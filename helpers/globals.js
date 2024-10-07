const globals = (objects, _) => {
  const globals = {
    header: _.find(objects, { slug: 'header' }) || {},
    nav: _.find(objects, { slug: 'nav' }) || {},
    social: _.find(objects, { slug: 'social' }) || {},
    contact_info: _.find(objects, { slug: 'contact-info' }) || {},
    footer: _.find(objects, { slug: 'footer' }) || {}
  };

  
  Object.keys(globals).forEach(key => {
    if (_.isEmpty(globals[key])) {
      console.warn(`Global object for ${key} not found.`);
    }
  });

  return globals;
}

module.exports = globals;
