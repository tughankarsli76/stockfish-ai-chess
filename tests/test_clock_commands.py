import unittest
from server import valid_command

class ClockCommands(unittest.TestCase):
    def test_tablebase_limits_are_not_user_commands(self):
        for value in ['0', '3', '4', '5', '7', '-1', '03', '3.5', '3\nstop']:
            self.assertFalse(valid_command('setoption name SyzygyProbeLimit value ' + value))

    def test_game_clocks(self):
        self.assertTrue(valid_command('go wtime 180000 btime 179000 winc 0 binc 2000'))
        self.assertTrue(valid_command('go wtime 1 btime 2147483647 winc 60000 binc 60000'))
        for command in ['go wtime -1 btime 3 winc 0 binc 0', 'go wtime 0 btime 3 winc 0 binc 0', 'go wtime 3 btime 3 winc 60001 binc 0', 'go wtime 3 btime 3 winc 0 binc 0\nquit']:
            self.assertFalse(valid_command(command))

if __name__ == '__main__':
    unittest.main()
