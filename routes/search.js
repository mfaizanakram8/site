const bucket = require('../bucket.json'); 
const _ = require('lodash');

module.exports = (app, partials) => {
  app.get('/search', async (req, res) => {
    try {
      
      const objects = bucket.objects || []; 
      
      if (!Array.isArray(objects)) {
        throw new Error("Invalid objects in bucket");
      }

      
      const searchable_objects = [
        ..._.filter(objects, { type_slug: 'pages' }),
        ..._.filter(objects, { type_slug: 'blogs' })
      ];

      res.locals.globals = require('../helpers/globals')(objects, _);
      const page = _.find(objects, { 'slug': 'search' });
      res.locals.page = page;

      if (req.query.q) {
        res.locals.q = req.query.q;
        const q = req.query.q.toLowerCase();
        let search_results = [];

        searchable_objects.forEach(object => {
          // Check if title or content contains the search query
          if ((object.title && object.title.toLowerCase().includes(q)) ||
              (object.content && object.content.toLowerCase().includes(q))) {
            object.teaser = object.content.replace(/(<([^>]+)>)/ig, "").substring(0, 300);
            object.permalink = object.type_slug === 'blogs' ? '/blog/' + object.slug : '/' + object.slug;
            search_results.push(object);
          }

          // Check metafields for search query
          if (!_.find(search_results, { _id: object._id }) && object.metafields) {
            object.metafields.forEach(metafield => {
              if (metafield.value && metafield.value.toLowerCase().includes(q)) {
                object.teaser = object.content.replace(/(<([^>]+)>)/ig, "").substring(0, 300);
                object.permalink = object.type_slug === 'blogs' ? '/blog/' + object.slug : '/' + object.slug;
                search_results.push(object);
              }
            });
          }
        });

        res.locals.search_results = search_results;
      }

      return res.render('search.html', { partials });
    } catch (error) {
      console.error("Error in /search route:", error);
      return res.status(500).send({ "status": "error", "message": error.message });
    }
  });
};
