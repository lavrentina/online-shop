// const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

// const { readFile, writeFile } = require("node:fs/promises");

class UsersRepository extends Repository {
	async create(attributes) {
		const { password } = attributes;

		// assigning users/products with unique IDs
		attributes.id = this.randomId();

		const salt = crypto.randomBytes(8).toString("hex");
		const buf = await scrypt(password, salt, 64);

		const records = await this.getAll();
		const record = {
			...attributes,
			password: `${buf.toString("hex")}.${salt}`,
		};

		records.push(record);

		await this.writeAll(records);

		return record;
	}

	async comparePasswords(saved, supplied) {
		// Saved -> password saved in our database ("hashed.salt")
		// Supplied -> password given to us by the user trying to sign in

		const [hashed, salt] = saved.split(".");
		const hashedSupplied = await scrypt(supplied, salt, 64);

		return hashed === hashedSupplied.toString("hex");
	}
}

module.exports = new UsersRepository("users.json");
