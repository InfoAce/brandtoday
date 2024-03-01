let _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? 
                function (obj) { 
                    return typeof obj; 
                } : 
                    function (obj) { 
                        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; 
                    };

export const paginate =  function (collection,data: any = { page: 1, perPage: 10 }) {
  
  if (!Array.isArray(collection)) {
    throw "Expect array and got " + (typeof collection === "undefined" ? "undefined" : _typeof(collection));
  }

  let { page, perPage } = data;
  let offset            = (page - 1) * perPage;
  let paginatedItems    = collection.slice(offset, offset + perPage);

  return {
    currentPage: parseInt(page),
    perPage:     parseInt(perPage),
    total:       collection.length,
    totalPages:  Math.ceil(collection.length / perPage),
    data:        paginatedItems
  };

};