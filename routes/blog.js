module.exports = (app, config, bucket, partials, _) => {
  
  app.get('/blog', async (req, res) => {
    try {
      
      const response = await bucket.getObjects();
      console.log('Bucket Response:', response);  
      
      const objects = response.objects;
      
      
      res.locals.globals = require('../helpers/globals')(objects, _);
      
    
      const page = _.find(objects, { 'slug': 'blog' });
      if (!page) {
        console.log('Blog page not found');  
        return res.status(404).render('404.html', { partials });
      }

      res.locals.page = page;

      
      const blogs = _.filter(objects, { 'type_slug': 'blogs' });
      blogs.forEach((blog, i) => {
      
        if (blog.created) {
          blogs[i].timestamp = new Date(blog.created).getTime();
        } else {
          console.log(`Blog at index ${i} has no created date`);
        }
      });

      res.locals.blogs = blogs;

      
      return res.render('blog.html', { partials });

    } catch (error) {
      
      console.error('Error fetching objects or rendering blog page:', error.stack);
      return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" });
    }
  });

  // Route for a single blog post
  app.get('/blog/:slug', async (req, res) => {
    const slug = req.params.slug;

    try {
      // Fetch objects from the bucket
      const response = await bucket.getObjects();
      console.log('Bucket Response:', response);  // Debugging response
      
      const objects = response.objects;

      
      res.locals.globals = require('../helpers/globals')(objects, _);
      
      
      const page = _.find(objects, { slug });
      if (!page) {
        console.log(`Page not found for slug: ${slug}`);  
        res.locals.page = _.find(objects, { 'slug': '404-page-not-found' });
        return res.status(404).render('404.html', { partials });
      }

      res.locals.page = page;

      
      if (page.created) {
        res.locals.page.timestamp = new Date(page.created).getTime();
      } else {
        console.log(`Page with slug ${slug} has no created date`);
      }

      
      return res.render('blog-single.html', { partials });

    } catch (error) {
      
      console.error('Error fetching objects or rendering single blog page:', error.stack);
      return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" });
    }
  });
};
