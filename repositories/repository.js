const fs = require("fs");
const crypto = require("crypto");

module.exports = class Repository {
	constructor(filename) {
		if (!filename) {
			throw new Error("Creating a repository requires a filename");
		}

		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, "[]");
		}
	}

	async create(attributes) {
		attributes.id = this.randomId();
		const records = await this.getAll();
		records.push(attributes);
		await this.writeAll(records);

		return attributes;
	}

	// gets the list of all users
	async getAll() {
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding: "utf8",
			})
		);
	}

	// writes all users ("records" array) to this.filename(e.g. "users.js")
	async writeAll(records) {
		await fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 2)
		);
	}

	// generating unique IDs
	randomId() {
		return crypto.randomBytes(4).toString("hex");
	}

	// finds the user with the given ID
	async getOne(id) {
		const records = await this.getAll();
		return records.find((record) => record.id === id);
	}

	// finds one user with the given filters
	async getOneBy(filters) {
		const records = await this.getAll();

		for (let record of records) {
			let found = true;

			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
			}

			if (found) {
				return record;
			}
		}
	}

	// deleted the user with the given ID
	async delete(id) {
		const records = await this.getAll();
		const filteredRecords = records.filter((record) => record.id !== id);

		await this.writeAll(filteredRecords);
	}

	// updates the user with the given ID using the given attributes
	async update(id, attributes) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);

		if (!record) {
			throw new Error(`Record with ID of ${id} not found`);
		}

		Object.assign(record, attributes);
		await this.writeAll(records);
	}
};
