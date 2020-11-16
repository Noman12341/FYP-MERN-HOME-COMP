const initialState = {
    cartItems: [],
    totalItems: 0,
    totalAmount: 0
}
export const MyCartReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_ITEM_TO_CART":
            let tempCart = [...state.cartItems];
            let alreadyInCart = false;
            tempCart.forEach(item => {
                if (item.ID === action.payload.ID) {
                    item.units++;
                    item.total = item.price * item.units;
                    alreadyInCart = true;
                }
            });
            if (!alreadyInCart) {
                tempCart.push({ ...action.payload, units: 1, total: action.payload.price });
            }

            return { ...state, cartItems: [...tempCart], totalAmount: tempCart.reduce((a, c) => a + c.price * c.units, 0), totalItems: tempCart.reduce((a, c) => a + c.units, 0) };
        case "REMOVE_FROM_CART":
            let newCart = state.cartItems.filter(item => item.ID !== action.payload.ID);
            return { ...state, cartItems: [...newCart], totalAmount: newCart.reduce((a, c) => a + c.price * c.units, 0), totalItems: newCart.reduce((a, c) => a + c.units, 0) }
        case "CLEAR_CART":
            return { ...state, cartItems: [], totalItems: 0, totalAmount: 0 }
        case "APPLY_DISCOUNT":
            return { ...state, totalAmount: state.totalAmount - action.payload }
        default:
            return state;
    }
}