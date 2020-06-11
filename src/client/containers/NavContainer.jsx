import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import NavItem from '../components/NavItem';
import * as actions from '../actions/actions';
import { connect } from 'react-redux';
import axios from 'axios';
// define width of sidebar
const drawerWidth = 200;

// custom styles for the sidebar
const useStyles = makeStyles((theme) => ({
  // drawer stays at fixed width, no matter the size of the screen
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  // width of background of drawer
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
}));

// pass in topic list from store

const mapStateToProps = (state) => ({
  topics: state.topics,
  currentTopic: state.currentTopic,
});

// pass in function that will make GET request to relevant topic from our DB

const mapDispatchToProps = (dispatch) => ({
  getResources: (tech_name) => {
    dispatch(actions.getResource(tech_name));
    // THIS IS A PLACEHOLDER FOR LATER EXTENSION:
    // ideally, the current topic being viewed would be stored in a (at the moment non-existent) 'users' table, so that the current topic will persist when that user refreshes. For now, we are holding that information on the front-end, in our store
    dispatch(actions.updateTopic(tech_name));
  },
  getTopics: () => {
    dispatch(actions.getTopics());
  },
  getUserInfo: () => {
    dispatch(actions.getUserInfo());
  }
});

function NavContainer(props) {
  // gives us access to styles object generated by makeStyles
  const classes = useStyles();

  // react hook that works the same as componentDidMount
  // [] means that it will only fire on first render
  useEffect(() => {
    // call new action to get topics
    props.getTopics();
    props.getResources(props.currentTopic); 
    // props.getUserInfo();
  }, []);
  /* Drawer is our sidebar navigation component, stays permanently fixed to side, as docs recommend on desktop usage */
  return (
    <Drawer
      // targets the nested component of the drawer (in this case, the paper)
      classes={{
        paper: classes.drawerPaper,
      }}
      className={classes.drawer}
      variant="permanent"
    >
      {/* NOT QUITE SURE WHAT THIS TOOLBAR DOES, but I saw it in the docs */}
      <Toolbar />
      <div className={classes.drawerContainer}>
        {/* map topics to new navbar items (rendered as a list) */}
        <List>
          {props.topics.map((topic) => {
            return (
              <NavItem topic={topic} key={topic} getFunc={props.getResources} />
            );
          })}
        </List>
      </div>
    </Drawer>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(NavContainer);
