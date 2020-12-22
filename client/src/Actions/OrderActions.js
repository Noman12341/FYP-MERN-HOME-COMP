export const FetchOrderDetails = (orderID, name, email, phone, amountPayed) => {
    return {
        type: "FETCH_ORDERS_DETAILS",
        payload: { orderID, name, email, phone, amountPayed }
    }
}
export const SaveCustomerInfo = (info) => {
    return {
        type: "SAVE_CUSTOMER_INFO",
        payload: { name: info.name, email: info.email, phone: info.phone, address: info.address }
    }
}