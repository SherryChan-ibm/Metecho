#!/bin/sh
# Use the presence of $PORT as a proxy for "are we local or Heroku?"
if [ -z ${PORT+x} ];
then
    # PORT unset, we presume this is local dev:
    print("If part 1")
    python manage.py migrate
    yarn serve
else
    # PORT set, we presume this is Heroku:
    print("If part 2")
    yarn django:serve:prod
fi
