//filters the recipes

module.exports = {
  filterRecipes: function (recipes, searchText) {
    var filteredRecipes = recipes;

    // Filter by searchText
    filteredRecipes = filteredRecipes.filter((recipe) => {
      //debugger;
      var text = recipe.title.toLowerCase();

      var lwrSearchText = searchText.toLowerCase();

      if (text.indexOf(lwrSearchText) > -1) {
        return recipe;
      }

    });

    return filteredRecipes;
  }
};
