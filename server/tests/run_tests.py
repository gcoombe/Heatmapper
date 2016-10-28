#!/usr/bin/env python3

import unittest
from os import sys, path

def main(modules=None):
    loader = unittest.TestLoader()
    if modules:
        test_modules = ['test_' + x for x in modules]
        test_suite = loader.loadTestsFromNames(test_modules)
    else:
        # Run them all
        test_suite = loader.discover('.')

    test_runner = unittest.runner.TextTestRunner(verbosity=1)
    test_runner.run(test_suite)

if __name__ == '__main__' and __package__ is None:
    # Add root path to sys.path for module discovery.
    sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

if __name__ == '__main__':
    # Accept module name arguments
    if len(sys.argv) > 1:
        main(sys.argv[1:])
    else:
        main()
