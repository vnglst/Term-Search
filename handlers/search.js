'use strict';

var DictEntry = require('../models/dictEntryModel');
var url = require('../lib/url');

// Helper function
// TODO: Move to lib
// TODO: Use same function for webclient as well
const mergeDuplicates = (dictEntries) => {
	const onlyUniques = [];
	dictEntries.forEach((entry, i) => {
		let unique = true;
		if (onlyUniques.forEach((uniqueEntry) => { // FIXME Why if here? See search.js webclient
				if (uniqueEntry.de === entry.de) {
					unique = false;
					// add Dutch translations to existing uniqueEntry
					uniqueEntry.nl = uniqueEntry.nl.concat(entry.nl);
				}
			}));
		if (unique) onlyUniques.push(entry);
	});
	return onlyUniques;
};

// exports.searchClient = (req, res, next) => {
// 	res.render('search-client');
// };

exports.searchpage = (req, res, next) => {
	const term = req.query.term;
	const regexQuery = new RegExp('^' + term, 'i');
	DictEntry.findTranslationByRegex(regexQuery)
		.then(function (dictEntries) {
			// if dictEntries found, render jade file
			if (dictEntries) {
        // Filter out duplicate search results
				let onlyMerged = mergeDuplicates(dictEntries);

				res.render('de-nl-searchpage', {
					dictEntries: onlyMerged,
					searchTerm: term
				});
			} else {
				res.render('de-nl-notfound', {
					germanStr: term,
					searchTerm: term
				});
			}
		})
    // Pass error on to next()
    .then(null, next);
};

// Handles search query from submit post
exports.query = function (req, res) {
	if (!req.body) return res.sendStatus(400);
	res.redirect(req.app.locals.clienturl + '?term=' + req.body.q);
};

exports.searchpage = (req, res, next) => {
	const term = req.query.term;
	const regexQuery = new RegExp('^' + term, 'i');
	DictEntry.findTranslationByRegex(regexQuery)
		.then(function (dictEntries) {
			// if dictEntries found, render jade file
			if (dictEntries) {
        // Filter out duplicate search results
				let onlyMerged = mergeDuplicates(dictEntries);

				res.render('de-nl-searchpage', {
					dictEntries: onlyMerged,
					searchTerm: term
				});
			} else {
				res.render('de-nl-notfound', {
					germanStr: term,
					searchTerm: term
				});
			}
		})
    // Pass error on to next()
    .then(null, next);
};

// For tests
exports.mergeDuplicates = mergeDuplicates;
