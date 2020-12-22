const initialState = {
    orderID: "",
    name: "",
    email: "",
    phone: "",
    amountPayed: "",
    customerInfo: {
        name: "",
        email: "",
        phoneNo: "",
        address: {
            city: "",
            country: "PK",
            line1: ""
        }
    }
}
export const OrderReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_ORDERS_DETAILS":
            const { orderID, name, email, phone, amountPayed } = action.payload;
            return { ...state, orderID, name, email, phone, amountPayed }
        case "SAVE_CUSTOMER_INFO":
            return { ...state, customerInfo: { ...action.payload } }
        default:
            return state;
    }
}