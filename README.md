# liver-simulator
Liver simulator as a hepatology educational tool

Run the index.html file via Chrome or your browser of choice
Enable console from developer tools so you can run commands

A new Liver is already instantiated with the name "liver"

Use the liver.createCells(#rows,#columns) to create new liver cells

i.e.
liver.createCells(10,10) will create a grid of cells 10 by 10 and assign them appropriate differentiation such as hepatocyte, cholangiocyte, duct, and vein.

the cells will be created in a 2-dimensional array called "cells" inside "liver"

Use the command cell.kill() to kill a certain cell and change its state from living to dead

i.e.
liver.cells[1][1].kill() << this will kill the cell in the second row and second column.
