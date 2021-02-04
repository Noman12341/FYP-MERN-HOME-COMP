export const getScrapedProducts = (almirah, gulAhmed, alkarm, diners) => {
    return {
        type: "ADD_SCRAPED_PRODUCTS",
        payload: {
            almirah,
            gulAhmed,
            alkarm,
            diners
        }
    }
}
export const getScrapItemDetail = (productObj) => {
    return {
        type: "ADD_SCRAPED_PRODUCTS_DETAILS",
        payload: productObj
    }
}
export const getScrapPLink = (link) => {
    return {
        type: "SCRAP_LINK",
        payload: link
    }
}
export const storeSearchedWord = (word) => {
    return {
        type: "ADD_SEARCHED_WORD",
        payload: word
    }
}
export const searchOn = () => {
    return { type: "SEARCH_TAG" }
}
export const storeProductID = (id) => {
    return {
        type: "P_CLICKED_ID",
        payload: id
    }
}