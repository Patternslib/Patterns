Making a release
================

* merge master into the "release" branch
* make sure all tests are passing

    ```make check```

* create a new bundle and commit that

    ```make bundle```

* tag the release

    ```git tag 2.0.0```
    ```git push --tags```
