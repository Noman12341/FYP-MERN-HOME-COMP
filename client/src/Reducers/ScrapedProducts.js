const initialState = {
    searchedWord: "",
    almirah: [],
    gulAhmed: [],
    alkarm: [],
    diners: [],
    scrapLink: "",
    productDetail: {},
    search: false,
    pClickedID: ""
}
export const scraperReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_SCRAPED_PRODUCTS":
            return {
                ...state,
                almirah: action.payload.almirah,
                gulAhmed: action.payload.gulAhmed,
                alkarm: action.payload.alkarm,
                diners: action.payload.diners
            }
        case "SCRAP_LINK":
            return { ...state, scrapLink: action.payload }
        case "ADD_SCRAPED_PRODUCTS_DETAILS":
            return { ...state, productDetail: action.payload }
        case "ADD_SEARCHED_WORD":
            return { ...state, searchedWord: action.payload }
        case "SEARCH_TAG":
            return { ...state, search: !state.search }
        case "P_CLICKED_ID":
            return { ...state, pClickedID: action.payload }
        default:
            return state;
    }
}