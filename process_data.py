import argparse

def parseLine():
    line = data.readline().split(" ")[1:]
    line[-1] = line[-1].rstrip("\n")
    return line

parser = argparse.ArgumentParser(description="Parse PCD")

data = open("lidar_data/lidar_points_235.pcd")

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
    "points"    : int(data.readline().split(" ")[1])
}


print(parseDict)