const parseUserQuery = async (req, res, next) => {
  try {
    const { userQuery } = req.body;

    if (!userQuery) {
      return res.status(400).json({ error: 'User query is required' });
    }

    res.locals.userQuery = userQuery;
    next();
  } catch (error) {
    console.error('Error in parseUserQuery:', error);
    next(error);
  }
};


export { parseUserQuery};
