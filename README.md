### Mock functions for the Hive Javascript API ###

When this file is included, it will define the 'bitcoin' object - unless the
real one is available - and offer the various API calls as mock functions which
do nothing and return success and/or dummy data.

Hint: You might want to run Chrome with the '--disable-web-security' flag in
order to allow makeRequest() to work properly.
