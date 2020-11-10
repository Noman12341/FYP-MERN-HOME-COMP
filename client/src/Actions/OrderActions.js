export const FetchOrderDetails = (orderID, name, email, phone, amountPayed) => {
    return {
        type: "FETCH_ORDERS_DETAILS",
        payload: { orderID, name, email, phone, amountPayed }
    }
}