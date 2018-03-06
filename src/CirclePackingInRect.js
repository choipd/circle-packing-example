//import liraries
import _ from 'lodash'
import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import Svg, {
  Defs,
  Circle,
  Path,
  Text,
  Stop,
  LinearGradient,
  G,
} from 'react-native-svg'

// create a component
class CirclePackingInRect extends Component {

  constructor(props) {
    super(props)

    this.circles = []

    console.log(props)

    this.fontRatio = 5
    this.retryCount = 0

    const temperature = this.props.temperature || 1

    let colors, opacities, positions

    if (temperature > 3 && temperature < 7) {
      colors = ['#ffa576', '#ff5991']
      opacities = [1, 1]
      positions = ['100%', '0%', '0%', '100%']
    } else if (temperature > 6 && temperature < 11) {
      colors = ['#ffa576', '#ff5991']
      opacities = [1, 1]
      positions = ['100%', '0%', '0%', '100%']
    } else {
      colors = ['#5e57f9', '#f957dc']
      opacities = [1, .4, 0.46]
      positions = ['0%', '100%', '100%', '0%']
    }


    this.state = {
      temperature,
      colors,
      opacities,
      positions,
      points: [],
      distanceFromPath: this.props.distanceFromPath || 0,
    }
  }

  componentDidMount() {
    const { keywords } = this.props
    console.log(keywords)
    const list = keywords.sort((a, b)=> {
      return b.length - a.length
    })
    console.log(list)
    list.forEach(item => {
      this.getRandomCircle(item)
    });
  }

  selectKeyword = (item) => {
    const newPoints = this.state.points.filter(point => point.keyword != item.keyword)
    newPoints.push({...item, selected: !item.selected})
    this.setState({points: newPoints})
    console.log(this.state.points)
  }

  getRandomCircle = (keyword) => {
    if(this.retryCount % 10) {
      this.fontRatio -= 0.01
    }
    const { width, height } = this.props.style

    const length = keyword.length * this.fontRatio
    const posX = Math.random() * width
    const posY = Math.random() * height
    
    const circle = {x: posX, y: posY, r: length, keyword}
    const collision = this.checkCollision(circle)
    const inside = this.checkInsideShape(circle)
    // console.log(`circle: ${circle} collision: ${collision} inside: ${inside}`)
    if(!collision && inside) {
      this.circles.push(circle)
      this.setState({points: this.circles})
    } 
    else {
      this.retryCount++
      this.getRandomCircle(keyword)
    }
  }

  checkCollision = (circle) => {
    return this.circles.some(item => {
      return Math.sqrt(Math.pow(circle.x - item.x, 2) + Math.pow(circle.y - item.y, 2)) < (circle.r + item.r)
    })
  }

  checkInsideShape = (circle) => {
    const points = [
      { x: circle.x,             y: circle.y - circle.r },
      { x: circle.x + circle.r,  y: circle.y },
      { x: circle.x,             y: circle.y + circle.r },
      { x: circle.x - circle.r,  y: circle.y }
    ]
    const { width, height } = this.props.style
    const { distanceFromPath } = this.state
    return !points.some(point => {
      const { x, y } = point
      const inside = (x > 0 + distanceFromPath && x < width - distanceFromPath && y > 0 + distanceFromPath && y < height - distanceFromPath)
      return !inside
    })
  }

  render() {
    const { width, height } = this.props.style  
    const { colors, opacities, positions } = this.state

    return (
      <View style={styles.container}>
        <Svg
          height={height} 
          width={width}
        >
          <Defs>
            <LinearGradient id="circleStrokeColor" x1={positions[0]} y1={positions[1]} x2={positions[2]} y2={positions[3]}>
              <Stop offset="0" stopColor={colors[0]} stopOpacity={opacities[0]}/>
              <Stop offset="1" stopColor={colors[1]} stopOpacity={opacities[1]}/>
            </LinearGradient>
          </Defs>

          { 
            this.state.points.map(item=>{
              return (
                <G key={item.keyword}>
                <Circle cx={item.x} cy={item.y} r={item.r} 
                  stroke="url(#circleStrokeColor)" strokeWidth="0.5" fill="#FFFFFF" opacity={opacities[2]} onPress={()=>this.selectKeyword(item)}>
                </Circle>
                <Text 
                  fill="#474747" 
                  fontSize="13" 
                  x={item.x} 
                  y={item.y} 
                  textAnchor="middle"
                  fontFamily="Roboto"
                  lineHeight="22"
                  alignmentBaseline="middle"
                >
                  {item.keyword}
                </Text>
                </G>
              )
            })
          }
        </Svg>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default CirclePackingInRect;
