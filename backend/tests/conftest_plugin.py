import pytest
from _pytest.terminal import TerminalReporter
from _pytest.config import Config
import time
import os

# Dictionary to store test start times
_test_start_times = {}

# Dictionary to store test durations
_test_durations = {}

# Dictionary to store test docstrings
_test_docs = {}


@pytest.hookimpl(trylast=True)
def pytest_configure(config):
    """Configure pytest with custom terminal reporter."""
    # Get the standard terminal reporter
    standard_reporter = config.pluginmanager.getplugin('terminalreporter')
    # Get our custom reporter
    stocksight_reporter = StockSightTerminalReporter(config)
    # Replace the standard terminal reporter with our custom one
    if standard_reporter:
        config.pluginmanager.unregister(standard_reporter)
        config.pluginmanager.register(stocksight_reporter, 'terminalreporter')


@pytest.hookimpl(tryfirst=True)
def pytest_collection_modifyitems(items):
    """Store test docstrings for later use."""
    for item in items:
        _test_docs[item.nodeid] = item.obj.__doc__ or "No description available"


@pytest.hookimpl(tryfirst=True)
def pytest_runtest_setup(item):
    """Record test start time."""
    _test_start_times[item.nodeid] = time.time()


@pytest.hookimpl(trylast=True)
def pytest_runtest_teardown(item):
    """Calculate test duration."""
    if item.nodeid in _test_start_times:
        _test_durations[item.nodeid] = time.time() - _test_start_times[item.nodeid]


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Extend test reporting with additional information."""
    outcome = yield
    report = outcome.get_result()
    
    # Add test docstring to report for use in terminal output
    if report.when == 'call':
        report.test_doc = _test_docs.get(item.nodeid, "")
        report.test_duration = _test_durations.get(item.nodeid, 0)


class StockSightTerminalReporter(TerminalReporter):
    """Custom terminal reporter for StockSight tests."""
    
    def __init__(self, config):
        super().__init__(config)
        self.verbose = config.getoption('verbose') > 0
        self.show_slow_tests = True
        self.slow_test_threshold = 1.0  # seconds
        
    def _get_progress_color(self, passed, failed, total):
        """Return color based on test progress."""
        if failed > 0:
            return "red"
        elif passed == total:
            return "green"
        else:
            return "yellow"
    
    def _write_test_description(self, rep):
        """Write test description with appropriate formatting."""
        if hasattr(rep, 'test_doc') and rep.test_doc and self.verbose:
            doc = rep.test_doc.strip()
            self.write_line(f"    {doc}", green=True)
    
    def _write_test_duration(self, rep):
        """Write test duration with appropriate formatting."""
        if hasattr(rep, 'test_duration'):
            duration = rep.test_duration
            if duration > self.slow_test_threshold and self.show_slow_tests:
                self.write_line(f"    SLOW TEST: {duration:.2f}s", yellow=True)
            elif self.verbose:
                self.write_line(f"    Duration: {duration:.2f}s", cyan=True)
    
    def pytest_runtest_logreport(self, report):
        """Report test results with enhanced output."""
        super().pytest_runtest_logreport(report)
        
        if report.when == "call":
            if report.passed:
                self._write_test_description(report)
                self._write_test_duration(report)
            elif report.failed:
                self._write_test_description(report)
                self._write_test_duration(report)
                
                # Add more context for failures
                if hasattr(report, 'longrepr'):
                    self.write_line("    Failure details:", red=True)
                    # Extract just the assertion message without the traceback
                    if hasattr(report.longrepr, 'reprcrash') and hasattr(report.longrepr.reprcrash, 'message'):
                        message = report.longrepr.reprcrash.message
                        self.write_line(f"    {message}", red=True)
    
    def summary_stats(self):
        """Print enhanced summary statistics."""
        super().summary_stats()
        
        session_duration = time.time() - self._sessionstarttime
        passed = len(self.stats.get('passed', []))
        failed = len(self.stats.get('failed', []))
        skipped = len(self.stats.get('skipped', []))
        total = passed + failed + skipped
        
        if total > 0:
            self.write_sep("=", "StockSight Test Summary", bold=True)
            
            # Calculate percentages
            pass_percent = (passed / total) * 100 if total else 0
            fail_percent = (failed / total) * 100 if total else 0
            skip_percent = (skipped / total) * 100 if total else 0
            
            # Get color based on results
            summary_color = self._get_progress_color(passed, failed, total)
            
            # Write summary
            self.write_line(f"Total tests: {total}", bold=True)
            self.write_line(f"Passed: {passed} ({pass_percent:.1f}%)", green=(summary_color == 'green'))
            if failed:
                self.write_line(f"Failed: {failed} ({fail_percent:.1f}%)", red=True)
            if skipped:
                self.write_line(f"Skipped: {skipped} ({skip_percent:.1f}%)", yellow=True)
            
            self.write_line(f"Total time: {session_duration:.2f}s", cyan=True)
            
            # Show slowest tests
            if self.show_slow_tests:
                slow_tests = [(nodeid, duration) for nodeid, duration in _test_durations.items() 
                              if duration > self.slow_test_threshold]
                
                if slow_tests:
                    self.write_sep("=", "Slowest Tests", bold=True)
                    slow_tests.sort(key=lambda x: x[1], reverse=True)
                    for nodeid, duration in slow_tests[:5]:  # Show top 5 slowest tests
                        test_name = nodeid.split("::")[-1]
                        self.write_line(f"{test_name}: {duration:.2f}s", yellow=True)
