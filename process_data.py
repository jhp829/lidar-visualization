import argparse
import json

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

fileName = input("input file: ")
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

# datapoints
while True:
    line = parseCoordinate()
    if (line == False):
        break
    num = count
    
    if not epoch_taken:
        base_time = int(line[4])
        epoch_taken = True

    parseDict["dataPoints"][str(num)] = {
        "x"         : float(line[0]),
        "y"         : float(line[1]),
        "z"         : float(line[2]),
        "intensity" : float(line[3]),
        "timestamp" : int(line[4]) - base_time
    }
    count += 1

outputFile = input("Output file name: ")
output = open(("lidar_data/" + str(outputFile)), "w")
output.write(json.dumps(parseDict, sort_keys=True, indent=4, separators=(',', ': ')))
output.close()