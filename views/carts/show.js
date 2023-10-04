const layout = require("../layout");

module.exports = ({ items }) => {
	let totalPrice = 0;
	for (let item of items) {
		totalPrice += item.quantity * item.product.price;
	}

	const renderedItems = items
		.map((item) => {
			return `
        <div class="cart-item message">
          <h3 class="subtitle">${item.product.title}</h3>
          <div class="cart-right">
            <div>
              ${item.product.price} X ${item.quantity} =
            </div>
            <div class="price is-size-4">
              ${item.product.price * item.quantity} PLN
            </div>
            <div class="remove">
              <form method="POST" action="/cart/products/delete">
                <input hidden value="${item.id}" name="itemId" />
                <button class="button is-danger">
                  <span class="icon is-small">
                    <i class="fas fa-times"></i>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      `;
		})
		.join("");

	return layout({
		content: `
      <div id="cart" class="container">
        <div class="columns">
          <div class="column"></div>
          <div class="column is-four-fifths">
            <h3 class="subtitle"><b>Shopping Cart</b></h3>
            <div>
              ${renderedItems}
            </div>
            <div class="total message is-danger">
              <div class="message-header">
                Total
              </div>
              <div class="price-button-wrapper">
                <h1 class="title">${totalPrice} PLN</h1>
                <button class="button is-danger is-outlined" id="buy-btn">Buy</button>
              </div>
            </div>
          </div>
          <div class="column"></div>
        </div>
      </div>
    `,
	});
};
