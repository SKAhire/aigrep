import keytar from "keytar";

await keytar.deletePassword("aigrep", "provider");
await keytar.deletePassword("aigrep", "model");
await keytar.deletePassword("aigrep", "apiKey");
await keytar.deletePassword("aigrep", "Test");

console.log("Keychain cleared!");
