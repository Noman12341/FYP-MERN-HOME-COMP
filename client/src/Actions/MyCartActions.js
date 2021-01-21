export const AddItemInCart = (product) => {
    return {
        type: "ADD_ITEM_TO_CART",
        payload: { ID: product._id, name: product.name, image: product.image, price: product.price, isMyProduct: product.isMyProduct, catagory: product.catagory, size: product.size }
    }
}
export const RemoveItemFromCart = (ID) => {
    return {
        type: "REMOVE_FROM_CART",
        payload: { ID }
    }
}
export const ClearCart = () => {
    return {
        type: "CLEAR_CART"
    }
}
export const applyDiscount = amount => {
    console.log(amount);
    return {
        type: "APPLY_DISCOUNT",
        payload: amount
    }
}