EMPTY_CELL = 0

def _solve(input_matrix):

  found = _find_empty_matrix(input_matrix)

  if not found:
    return True
  else:
    row, col = found
  
  for num in range(1,10):
    if _is_valid(input_matrix, num, (row, col)):
      input_matrix[row][col] = num

      if _solve(input_matrix):
        return True

      input_matrix[row][col] = EMPTY_CELL

  return False

def _find_empty_matrix(input_matrix):
  row_len = len(input_matrix)
  col_len = len(input_matrix[0])
  
  for i in range(row_len):
    for j in range(col_len):
      if _el_unassigned(input_matrix[i][j]):
        return (i,j)

  return None

def _el_unassigned(el):
  return el == EMPTY_CELL

def _is_valid(input_matrix, num, curr_pos):
  row_len = len(input_matrix)
  col_len = len(input_matrix[0])
  
  # Check num in row
  for i in range(row_len):
    if input_matrix[curr_pos[0]][i] == num and curr_pos[1] != i:
      return False

  # Check num in column
  for j in range(col_len):
    if input_matrix[i][curr_pos[1]] == num and curr_pos[0] != i:
      return False

  # Check num in 3x3 box
  box_x = curr_pos[1] // 3
  box_y = curr_pos[0] // 3

  for i in range(box_y*3, box_y*3 + 3):
      for j in range(box_x * 3, box_x*3 + 3):
          if input_matrix[i][j] == num and (i,j) != curr_pos:
              return False

  return True