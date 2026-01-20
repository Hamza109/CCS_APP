const crypto = require("crypto");

const payload = {
    "iv": "JLRkcs8iICNVp+i2TNTsfw==",
    "data": "hfpN7s16mv7OO5QrdHlaO1MbS7N3WzqBU+1vx2c7cGwRQVlmEw3OF1L9jdb3zsSCOM2p6bFbka+FVzn6ad802xEHtTgxaPtZnI9cUnLhSFEw5utOVMuRIgmdtEqVViMYplXU/VlZn5M9quaeTDjdJxUOkTBVn7Z/j00whGglbCl7N+sBbDyLtm07buWl+jE/MwZxPWDB6WUA1CkJRDj+44QRRTeXlWuSYeBdH6qK199cLYAPXBcWzSnJMEfwf5DS0r04799fg3HJ3HqLRnH6jjPK54ArCG7Ve0TSu7xYbTSNA9jaJBXkO32tcWvJDX/1SNkRk7NcpA1AGWIYP6egMfaJlVnX9mSyPNpDqBd+EzkM/C4GvfvtQUOZkKvRW0C7cZyNQ6tZFDxCDH5KwNbZLA=="
}
const key = Buffer.from("9fA7KpM2XcR4WZy8LQnDHeJUTmV0aB1S");
const iv = Buffer.from(payload.iv, "base64");
const encrypted = Buffer.from(payload.data, "base64");

const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

let decrypted = decipher.update(encrypted);
decrypted = Buffer.concat([decrypted, decipher.final()]);

console.log("Decrypted value:", decrypted.toString());
