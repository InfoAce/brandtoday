let _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? 
                function (obj) { 
                    return typeof obj; 
                } : 
                    function (obj) { 
                        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; 
                    };

import { isEmpty,times } from 'lodash';

export const paginate =  function ({data:collection,response}) {
 
  let { req: { originalUrl} } = response;
  let page            = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
  let numItems        = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];

  if (!Array.isArray(collection)) {
    throw "Expect array and got " + (typeof collection === "undefined" ? "undefined" : _typeof(collection));
  }

  let currentPage    = parseInt(page);
  let perPage        = parseInt(numItems);
  let offset         = (page - 1) * perPage;
  let paginatedItems = collection.slice(offset, offset + perPage);
  let matchPage      = originalUrl.match(/page=\w+/);

  if( !isEmpty(matchPage) ){
    currentPage = parseInt(matchPage[0].match(/\d+/)[0]);
    originalUrl = originalUrl.replace(matchPage[0],'');
  }

  return {
    currentPage: currentPage,
    perPage:     perPage,
    total:       collection.length,
    totaPages:   Math.ceil(collection.length / perPage),
    totalPages:  Math.ceil(collection.length / perPage),
    links:       {
        currentPage,
        currentRoute: originalUrl,
        nextPage:     originalUrl.includes('?') ? 
                            (currentPage + 1) == collection.length  ? 
                                `${originalUrl}&page=${currentPage}`: 
                                    `${originalUrl}&page=${currentPage + 1}` : 
                            (currentPage + 1) == collection.length ? 
                                `${originalUrl}&page=${currentPage}` : 
                                    `${originalUrl}?page=${currentPage + 1}`,
        previousPage: originalUrl.includes('?') ? 
                        (currentPage + 1) == collection.length  ? 
                            `${originalUrl}&page=${currentPage}`: 
                                `${originalUrl}&page=${currentPage - 1}` : 
                        (currentPage + 1) == collection.length ? 
                            `${originalUrl}&page=${currentPage}` : 
                                `${originalUrl}?page=${currentPage - 1}`,
        pages:        times(
                        Math.ceil(collection.length / perPage),
                        page => ({
                            label: page + 1,
                            link: originalUrl.includes('?') ?  `${originalUrl}&page=${page + 1}` : `${originalUrl}?page=${page + 1}`
                        })
                      )
    },
    data:        paginatedItems
  };

};