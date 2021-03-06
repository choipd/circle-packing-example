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

import { getPixelRGBA } from 'react-native-get-pixel'

const MASKING_IMAGE = 'Heart.png'

// create a component
class CirclePacking extends Component {

  constructor(props) {
    super(props)

    this.circles = []

    console.log(props)

    this.pathData = 'M177.515742,320.495139 C171.237324,320.495139 164.958906,319.048479 159.110642,316.145042 L159.110642,316.145042 C8.2913218,241.20198 0.402114107,131.488494 0.402114107,109.555913 C0.310591976,107.613545 0.264830911,105.812807 0.264830911,104.072768 C0.264830911,46.965103 42.2917935,0.5 93.9651887,0.5 C129.887625,0.5 161.755631,22.8271244 177.442524,56.960209 C193.13857,22.8372409 225.006576,0.510116504 260.929012,0.510116504 C312.593255,0.510116504 354.62937,46.985336 354.62937,104.103118 C354.62937,105.843156 354.583609,107.694477 354.492087,109.596379 C354.501239,122.494922 352.167425,156.172764 330.915986,195.586664 C304.557612,244.489844 259.089418,285.067142 195.783559,316.215858 C189.971904,319.068712 183.748399,320.495139 177.515742,320.495139 L177.515742,320.495139 Z'
    this.fontRatio = 8
    this.retryCount = 0

    const temperature = this.props.temperature || 1

    let colors, opacities, positions

    if (temperature > 3 && temperature < 7) {
      colors = ['#c886ff', '#ff90aa']
      opacities = [1, 1]
      positions = ['100%', '0%', '0%', '100%']
    } else if (temperature > 6 && temperature < 11) {
      colors = ['#ffa576', '#ff5991']
      opacities = [1, 1]
      positions = ['100%', '0%', '0%', '100%']
    } else {
      colors = ['#5e57f9', '#f957dc']
      opacities = [1, .4]
      positions = ['0%', '100%', '100%', '0%']
    }


    this.state = {
      debug: this.props.debug ? true : false,
      temperature,
      colors,
      opacities,
      positions,
      points: [],
      distanceFromPath: this.props.distanceFromPath || 0,
      shape: this.getShapeFromPath(this.pathData)
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
    
    getPixelRGBA(MASKING_IMAGE, posX, posY)
    .then(color => {
      if(color[0] > 0 || color[1] > 0 || color[2] > 0) {
        // console.log(posX, posY, color)
        const circle = {x: posX, y: posY, r: length, keyword}
        const collision = this.checkCollision(circle)
        const inside = this.checkInsideShape(circle)
        // console.log(`circle: ${circle} collision: ${collision} inside: ${inside}`)
        if(!collision && inside) {
          this.circles.push(circle)
        } 
        else {
          this.retryCount++
          this.getRandomCircle(keyword)
        }
        this.setState({points: this.circles})
      } else {
        this.retryCount++
        this.getRandomCircle(keyword)
      }
    })
  }

  checkCollision = (circle) => {
    return this.circles.some(item => {
      return Math.sqrt(Math.pow(circle.x - item.x, 2) + Math.pow(circle.y - item.y, 2)) < (circle.r + item.r)
    })
  }

  checkInsideShape = (circle) => {
    // console.log('this.state.shape = ', this.state.shape)
    return !this.state.shape.positions.some(point => {
      return Math.sqrt(Math.pow(circle.x - point[0], 2) + Math.pow(circle.y - point[1], 2)) < circle.r + this.state.distanceFromPath
    })
  }


  getShapeFromPath = (svgPathData) => {
    var parse = require('parse-svg-path')
    var simplify = require('simplify-path')
    var contours = require('svg-path-contours')
    var triagulate = require('triangulate-contours')
    var threshold = 0.5

    var lines = contours(parse(svgPathData))
    lines = lines.map(path => {
      return simplify(path, threshold)
    })

    var shape = triagulate(lines)

    return shape
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
            <LinearGradient id="path" x1={positions[0]} y1={positions[1]} x2={positions[2]} y2={positions[3]}>
              <Stop offset="0" stopColor={colors[0]} stopOpacity={opacities[0]} />
              <Stop offset="1" stopColor={colors[1]} stopOpacity={opacities[1]} />
            </LinearGradient>
            <LinearGradient id="circleFill" x1={positions[0]} y1={positions[1]} x2={positions[2]} y2={positions[3]}>
              <Stop offset="0" stopColor={colors[0]} stopOpacity={opacities[0]}/>
              <Stop offset="1" stopColor={colors[1]} stopOpacity={opacities[1]}/>
            </LinearGradient>
          </Defs>
          <Path fill="#FFF" fillOpacity=".01" fillRule="evenodd" stroke="url(#path)" strokeWidth="1.5" d={this.pathData} opacity=".51" transform="translate(1 1)"/>

          { 
            this.state.points.map(item=>{
              return (
                <G key={item.keyword}>
                <Circle cx={item.x} cy={item.y} r={item.r} strokeWidth="2.5" fill="url(#circleFill)" opacity=".59" onPress={()=>this.selectKeyword(item)}>
                </Circle>
                <Text 
                  fill="#FFF" 
                  fontSize="13" 
                  x={item.x} 
                  y={item.y} 
                  textAnchor="middle"
                  fontFamily="Roboto-Regular"
                  lineHeight="22"
                  alignmentBaseline="middle"
                >
                  {item.keyword}
                </Text>
                </G>
              )
            })
          }

          {
            this.state.debug ? 
            this.state.shape.positions.map(point => {
              return (
                <G key={point.join('_')}>
                <Circle cx={point[0]} cy={point[1]} r={3} strokeWith="1" fill="#FF0000" />
                </G>
              )
            })              
            : null
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
export default CirclePacking;
