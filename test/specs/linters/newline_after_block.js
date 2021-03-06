'use strict';

var expect = require('chai').expect;
var spec = require('../util.js').setup();

describe('lesshint', function () {
    describe('#newlineAfterBlock()', function () {
        it('should have the proper node types', function () {
            var source = '.foo { color: red; }';

            return spec.parse(source, function (ast) {
                expect(spec.linter.nodeTypes).to.include(ast.root.first.type);
            });
        });

        it('should not allow adjacent blocks without a blank line', function () {
            var source = [
                '.foo { color: red; }',
                '.bar { color: blue; }'
            ];
            var expected = [{
                message: 'All blocks should be followed by a new line.'
            }];

            source = source.join('\n');

            return spec.parse(source, function (ast) {
                var result = spec.linter.lint({}, ast.root.last);

                expect(result).to.deep.equal(expected);
            });
        });

        it('should not allow adjacent blocks on the same line', function () {
            var source = [
                '.foo { color: red; }',
                '.bar { color: blue; }'
            ];
            var expected = [{
                message: 'All blocks should be followed by a new line.'
            }];

            source = source.join('');

            return spec.parse(source, function (ast) {
                var result = spec.linter.lint({}, ast.root.last);

                expect(result).to.deep.equal(expected);
            });
        });

        it('should allow adjacent blocks with a new line', function () {
            var source = [
                '.foo { color: red; }',
                '.bar { color: blue; }'
            ];

            source = source.join('\n\n');

            return spec.parse(source, function (ast) {
                var result = spec.linter.lint({}, ast.root.last);

                expect(result).to.be.undefined;
            });
        });

        it('should not allow adjacent blocks without a new line', function () {
            var source = [
                '.bar { color: blue; }',
                '@media (screen) {}'
            ];
            var expected = [{
                message: 'All blocks should be followed by a new line.'
            }];

            source = source.join('');

            return spec.parse(source, function (ast) {
                var result = spec.linter.lint({}, ast.root.last);

                expect(result).to.deep.equal(expected);
            });
        });

        it('should allow adjacent at-rule blocks with a new line', function () {
            var source = [
                '.bar { color: blue; }',
                '@media (screen) {}'
            ];

            source = source.join('\n\n');

            return spec.parse(source, function (ast) {
                var result = spec.linter.lint({}, ast.root.last);

                expect(result).to.be.undefined;
            });
        });

        it('should not check at-rules without a body', function () {
            var source = '@import "foo";';

            return spec.parse(source, function (ast) {
                var result = spec.linter.lint({}, ast.root.last);

                expect(result).to.be.undefined;
            });
        });

        it('should allow preceding comments without a new line', function () {
            var source = '';

            source += '.foo {';
            source += '    color: red;';
            source += '}';
            source += '\n\n';
            source += '// A comment';
            source += '\n';
            source += '.bar {';
            source += '    color: blue;';
            source += '}';

            return spec.parse(source, function (ast) {
                var result = spec.linter.lint({}, ast.root.last);

                expect(result).to.be.undefined;
            });
        });

        it('should not report nested blocks with a preceding new line', function () {
            var source = '';

            source += '.foo {';
            source += '    color: red;';
            source += '\n\n';
            source += '    .bar {';
            source += '        color: red;';
            source += '    }';
            source += '\n';
            source += '}';

            return spec.parse(source, function (ast) {
                var result = spec.linter.lint({}, ast.root.last);

                expect(result).to.be.undefined;
            });
        });

        it('should not report nested blocks with a preceding new line containing other white space', function () {
            var source = '';

            source += '.foo {';
            source += '    color: red;';
            source += '\n \t\n';
            source += '    .bar {';
            source += '        color: red;';
            source += '    }';
            source += '\n';
            source += '}';

            return spec.parse(source, function (ast) {
                var result = spec.linter.lint({}, ast.root.last);

                expect(result).to.be.undefined;
            });
        });
    });
});
