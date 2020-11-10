const initialState = {
    orderID: "",
    name: "",
    email: "",
    phone: "",
    amountPayed: ""
}
export const OrderReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_ORDERS_DETAILS":
            return { ...state, ...action.payload }
        default:
            return state;
    }
}