import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {getUserData} from '../actions/StorageActions';


class Authorization extends React.Component {
  static propTypes = {
    routes: PropTypes.array.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.userRoles = getUserData('roles');
    this.notAuthorizedPath = '/not-found';
  }

  authorizeRoute() {
    const {routes} = this.props;
    const routeRoles = getFlatterRoles(routes);
    if (false === rolesMatched(routeRoles, this.userRoles)) {
      this.handleUnauthorizedRole(routeRoles, this.userRoles);
    }
  }

  handleUnauthorizedRole(routeRoles, userRoles) {
    const {router} = this.context;
    router.push(this.notAuthorizedPath);
  }

  rolesMatched(allowedRoles) {
    this.validateAllowedRoles(allowedRoles, 'rolesMatched');
    return rolesMatched(allowedRoles, this.userRoles);
  }

  rolesMatchedExact(allowedRoles) {
    this.validateAllowedRoles(allowedRoles, 'rolesMatchedExact');
    return rolesMatchedExact(allowedRoles, this.userRoles);
  }

  validateAllowedRoles(allowedRoles, type) {
    if ('undefined' === typeof allowedRoles) {
      throw new Error('AuthorizationComponent: No allowed roles passed to ' + type + ' function!.');
    }
  }

}

export function getFlatterRoles(routeObjects) {
  return _.chain(routeObjects)
    .filter(item => item.authorize)
    .map(item => item.authorize)
    .flattenDeep()
    .union()
    .value();
}

export function rolesMatched(allowedRoles, userRoles) {
  return 0 < _.intersection(allowedRoles, userRoles).length;
}

export function rolesMatchedExact(allowedRoles, userRoles) {
  return _.isEqual(allowedRoles, userRoles);
}

export default Authorization;
