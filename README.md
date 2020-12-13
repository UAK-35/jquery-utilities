jquery-utilities
=========
A set of tools based on jQuery

[![GitHub](https://img.shields.io/github/license/UAK-35/jquery-utilities?color=yellow)](https://github.com/UAK-35/jquery-utilities/blob/main/LICENSE)
[![npm version](https://badge.fury.io/js/%40uak2020%2Fjquery-utilities.svg)](https://badge.fury.io/js/%40uak2020%2Fjquery-utilities)
[![Build Status](https://travis-ci.com/UAK-35/jquery-utilities.svg?token=b6yC3xZ4n29K1aBw3JL6&branch=main)](https://travis-ci.com/UAK-35/jquery-utilities)
[![Coverage Status](https://coveralls.io/repos/github/UAK-35/jquery-utilities/badge.svg?branch=main)](https://coveralls.io/github/UAK-35/jquery-utilities?branch=main)
[![Maintainability](https://api.codeclimate.com/v1/badges/bfd6d414400b5f2d23fe/maintainability)](https://codeclimate.com/github/UAK-35/jquery-utilities/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/bfd6d414400b5f2d23fe/test_coverage)](https://codeclimate.com/github/UAK-35/jquery-utilities/test_coverage)

> istanbul (nyc) coverage report

| Statements                  | Branches                | Functions                 | Lines                |
| --------------------------- | ----------------------- | ------------------------- | -------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-97.16%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/Coverage-72%25-red.svg) | ![Functions](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/Coverage-97.47%25-brightgreen.svg)    |

## Installation

`npm install @uak2020/jquery-utilities`

## Usage

    var { JqAjaxManager, UserInteraction, JsHelper } = require('@uak2020/jquery-utilities');

    var userInteraction = new UserInteraction();
    var jsHelper = new JsHelper();
    var ajaxMgr = new JqAjaxManager();
    ajaxMgr.userInteraction = userInteraction;
    ajaxMgr.jsHelper = jsHelper;
    ajaxMgr.performAjaxGet(
        'http://localhost:5000/test',
        {
            successMessage: 'page loaded',
            successCallback: function (result, url, textStatus) {
                userInteraction.logit(result);
            }
        },
        {
            failureMessage: 'page load error',
            failureCallback: function (textStatus, errorThrown) {
                userInteraction.logerror(errorThrown);
            }
        }
    );

Points to note:
- successMessage and failureMessage can be omitted
- successMessage and failureMessage if provided as above, then browser alerts will be shown
- one must set "userInteraction" field/property of JqAjaxManager object as done above like: `ajaxMgr.userInteraction = userInteraction;`
- one must set "jsHelper" field/property of JqAjaxManager object as done above like: `ajaxMgr.jsHelper = jsHelper;`

## Tests

`yarn test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
