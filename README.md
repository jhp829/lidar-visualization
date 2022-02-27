## Inspiration
One day while walking along the hallowed halls of the Oxford maths institute there was an idea, a simple Eureka moment. Before I was blind to the possibility but suddenly I could see: world-scale LiDAR visualization in web VR environments. The dots connected - I saw graphs flashing before my eyes, matrices being multiplied in my head.

## What is LiDAR Visualisation for?
For autonomous vehicles which collect 4TB+ per day, it's helpful to “see what the sensor can see”. We visualised the PCD formatted cloud data into a 3D virtual space (VR) to facilitate object detection.

## How we built it
To build this we first create a processing script to convert from noisy and unnormalised lidar data to a more manageable point cloud format.
The first step we took was to remove all data with intensity 0 as these are likely no more than small pieces of dust. Then, we deleted hundreds of duplicate points from the dataset as this was responsible for performance dips. Finally, datapoints were localised into 1x1 pillars to filter out any locations that are too far away from the user. This data was stored into json files as they can easily be used by virtually any language in the form of a map/dictionary.
For the visualisation component of our project we used the A-Frame library, which produces web VR scenes, and allows scenes to be easily shared. We initialise a scene, and then dynamically inject points based on the user’s position. We also colour these points depending on their distance from the camera. 
To teleport within the scene, we wrote functions to connect the controllers which detected and calculated positions within the environment and scaled the scenes with regards to where the user position was. 


## Challenges we ran into
The first challenge we ran into was understanding the format of the lidar data. After creating an initial VR visualisation we realised 2 things. Firstly, most of the data was under the ground, as the lidar was measuring distance from 2 metres above the ground. Secondly, the y and z axis were flipped from their ordinary positions, which needed to be corrected in the preprocessing stage.
One of the major obstacles we faced in this project was the limitation of our hardware. As we were using a VR headset with a mobile processor, having to process thousands of points resulted in severely low frames per second on demos.

To get around this we tried several optimisations. Firstly, to reduce the number of points loaded and drawn we segmented points into buckets based on their position and only loaded buckets around the user. We also removed a lot of duplicates in the preprocessing stage. The segmentation also required us to dynamically reload the points around the user. Another optimization we had to make was merging all of the points together into a single mesh so they only require a single draw call, although we’re unsure if this actually ended up making a difference. 


## Accomplishments that we're proud of
Overall, this was a very successful attempt on our first VR project. Although the aforementioned hardware capabilities of the headset limited how much we could do, we created a good visualisation of the area - objects could easily be identified immediately.
We also added a feature to dynamically load the points by setting the radius that we want to see for each location. Although there is some optimization work to do to use this feature in VR headset, this was one of the pleasing features that we were proud of.


## What we learned
The LiDAR collected a larger number of data points than we expected which meant that the dataset for each frame was very big and took a long time to process.

In addition, there were many aspects to take care of when analysing large data like this. From having viewpoints from different angles and changing scales to using shades and colouring the data points, it all played an important part in the data visualisation as it would’ve been difficult to distinguish different objects. 


## What's next for World-Scale LiDAR Visualisation in VR
We would really like to optimise it for VR to have less latency and also optimise the dataset to reduce noise. We also thought it would be really cool to have images changing in the background according to different time frames to make the experience even more immersive. For example the user would be able to scroll through time using a dial turned with their controllers. 

We would also like to add more visualisations based on the lidar data we were given. For example by computing a mesh using nearest neighbour mesh algorithms. From there we could even compute planes and show these instead of points. If we combine this data with image data we can colour the image in, and display a 3D coloured image.

# lidar-visualization
call 'npm start' in the root folder to start the server
