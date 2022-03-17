import sys
import json
from solver_utils import _solve


def solve_sudoku(input_matrix):
    if len(input_matrix) == 0:
        return []
  
    if _solve(input_matrix):
        return input_matrix
    else:
        return []


board = json.loads(sys.argv[1])
print(solve_sudoku(board))