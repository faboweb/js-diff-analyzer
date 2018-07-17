# js-diff-analyzer
Check if all of your changed code is covered by unit tests

## Install

```shell
$ npm install -g js-diff-analyzer
```

```shell
$ yarn global add js-diff-analyzer
```

### Usage

Run your tests in your project. Create coverage output via Istanbul in the `json` format. I.e. for Jest:

```shell
$ jest --coverageReporters ['json'] --collectCoverage true --coverageDirectory './coverage'
```

Then analyze the coverage report using js-diff-analyzer:

```shell
$ js-diff-analyzer -r './' -c './coverage'
```

This will output uncovered lines like this:

```shell                                                                                                                                          [00:20:35]
Changes on your branch are not covered:
app/src/renderer/components/common/AppHeader.vue (Lines: 35, 36 )
app/src/renderer/components/staking/PageBond.vue (Lines: 268, 269, 270, 271 )
app/src/renderer/components/staking/PageStaking.vue (Lines: 175, 176 )
```
