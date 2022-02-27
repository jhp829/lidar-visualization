import argparse
import json
import sys

def parseLine():
    line = data.readline()
    line = line.split(" ")[1:]
    line[-1] = line[-1].rstrip("\n")
    return line

def parseCoordinate():
    line = data.readline()
    if not line:
        return False
    line = line.split(" ")
    line[-1] = line[-1].rstrip("\n")
    return line

parser = argparse.ArgumentParser(description="Parse PCD")

fileName = sys.argv[1]
data = open(fileName)

# Metadata

parseDict = {
    "version"   : data.readline().split(" ")[1].rstrip("\n"),
    "fields"    : parseLine(),
    "sizes"     : [int(size) for size in parseLine()],
    "types"     : parseLine(),
    "count"     : [int(x) for x in parseLine()],
    "width"     : data.readline().split(" ")[1].rstrip("\n"),
    "height"    : int(data.readline().split(" ")[1]),
    "viewpoint" : [int(x) for x in parseLine()],
    "points"    : int(data.readline().split(" ")[1]),
    "dataPoints": {}
}

data.readline()
count = 0
epoch_taken = False
base_time = 0
last_coord = 0
duplicates_found = 0

# datapoints
while True:
    line = parseCoordinate()
    if line == last_coord:
        duplicates_found += 1
        continue
    else:
        last_coord = line
    if (line == False):
        break
    
    if not epoch_taken:
        base_time = int(line[4])
        epoch_taken = True

    x = int(float(line[0]) // 1)
    z = int(float(line[1]) // 1)

    try:
        parseDict["dataPoints"][str(x) + "," + str(z)][count] = {
            "x"         : float(line[0]),
            "y"         : -float(line[2]) + 0.5,
            "z"         : float(line[1]),
            "intensity" : float(line[3]),
            "timestamp" : int(line[4]) - base_time
        }
    except:
        parseDict["dataPoints"][str(x) + "," + str(z)] = {}
        parseDict["dataPoints"][str(x) + "," + str(z)][count] = {
            "x"         : float(line[0]),
            "y"         : -float(line[2]) + 0.5,
            "z"         : float(line[1]),
            "intensity" : float(line[3]),
            "timestamp" : int(line[4]) - base_time
        }
    count += 1

parseDict["duplicates"] = duplicates_found

output = open(sys.argv[2], "w")
output.write(json.dumps(parseDict, sort_keys=False, indent=4, separators=(',', ': ')))
output.close()