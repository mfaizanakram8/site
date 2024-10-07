module.exports = (app, config, bucket, partials, _) => {
  app.get('/faqs', async (req, res) => {
    try {
      const response = await bucket.getObjects();
      console.log('FAQs Response:', response); 
      const objects = response.objects;
      res.locals.globals = require('../helpers/globals')(objects, _);
      const page = _.find(objects, { 'slug': 'faqs' });
      res.locals.page = page;
      return res.render('faqs.html', { partials });
    } catch (error) {
      console.error('Error in /faqs:', error);
      return res.status(500).send({ "status": "error", "message": error.message });
    }
  });
};
