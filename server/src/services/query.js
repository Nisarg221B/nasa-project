// this query file will give us a reusable way of making any end point paginated.

const DEFAULT_PAGE_LIMIT = 0; // no page limit - mongo returns all the the documents
const DEFAULT_PAGE_NUMBER = 1;

function getPagination(query) {
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const skip = (page - 1) * limit;
    return {
        skip,
        limit,
    };
}

module.exports = {
    getPagination,
}