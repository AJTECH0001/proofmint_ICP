import { Canister, query, update, text, nat64, Vec, Opt } from 'azle';

type Product = {
    id: nat64;
    name: text;
    description: text;
    price: nat64;
    owner: text;
};

let products: Product[] = [];
let nextId: nat64 = 1n;

export default Canister({
    // Get all products
    getProducts: query([], Vec(Product), () => {
        return products;
    }),

    // Get product by ID
    getProduct: query([nat64], Opt(Product), (id) => {
        return products.find((product) => product.id === id) || null;
    }),

    // Add a new product
    addProduct: update([text, text, nat64, text], nat64, (name, description, price, owner) => {
        const newProduct: Product = { id: nextId, name, description, price, owner };
        products.push(newProduct);
        nextId++;
        return newProduct.id;
    }),

    // Update product details
    updateProduct: update([nat64, text, text, nat64], text, (id, name, description, price) => {
        const productIndex = products.findIndex((product) => product.id === id);
        if (productIndex === -1) return 'Product not found';

        products[productIndex] = { ...products[productIndex], name, description, price };
        return 'Product updated successfully';
    }),

    // Delete product
    deleteProduct: update([nat64], text, (id) => {
        products = products.filter((product) => product.id !== id);
        return 'Product deleted successfully';
    })
});
