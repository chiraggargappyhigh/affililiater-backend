const asyncExecute = (controller) => {
  return (request, response, next) => {
    controller(request, response, next).catch(next);
  };
};

module.export = asyncExecute ;
