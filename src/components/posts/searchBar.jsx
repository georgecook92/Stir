import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';

class SearchBar extends Component {
  render() {

    var {searchText} = this.props;

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

export default connect(null, actions)(SearchBar);
