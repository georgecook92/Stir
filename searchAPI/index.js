module.exports = {
  filterRecipes: function (recipes, searchText) {
    var filteredRecipes = recipes;

    // Filter by searchText
    filteredRecipes = filteredRecipes.filter((recipe) => {
      //debugger;
      var text = recipe.title.toLowerCase();
      
      if (text.indexOf(searchText) > -1) {
        return recipe;
      }

    });

    return filteredRecipes;
  }
};
