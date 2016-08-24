import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';

class SearchBar extends Component {
  render() {

    var {searchText} = this.props;

    //sends the search text value to the searchAPI filter on each change
    return (
          <input type='search' className='search-bar' ref='searchText' placeholder='Search Recipes' value={searchText} onChange={ () => {
              var searchText = this.refs.searchText.value;
              this.props.setSearchText(searchText);
            }} />

    );
  }
}

function mapStateToProps(state) {
  return {
    searchText: state.searchText
  }
}

export default connect(mapStateToProps, actions)(SearchBar);
