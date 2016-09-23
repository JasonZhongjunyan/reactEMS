import React, {Component} from 'react';
import Ripple from 'components/Ripple';
import ClickAway from 'internals/ClickAway';
import ReactTransitionGroup  from 'react-addons-transition-group';
import styles from './styles.css';

class TransitionItem extends Component {
	componentWillUnmount() {
        clearTimeout(this.enterTimer);
        clearTimeout(this.leaveTimer);
    }
	
	componentWillEnter(callback) {
        this.initAnimation(callback);
    }

    componentDidEnter() {
        this.animate();
    }

    componentWillLeave(callback) {
        this.leaveTimer = setTimeout(callback, 0);
    }
	
	animate() {
		this.style.visiblity = 'visible';
		this.style.transition = 'visiblity .3s cubic-bezier(.4,0,.2,1)';

		this.shadowStyle.transform = 'scale(1)';
		this.shadowStyle.opacity = 1;
		this.shadowStyle.transition = 'transform .3s cubic-bezier(.4,0,.2,1),opacity .2s cubic-bezier(.4,0,.2,1)';
		
		this.contentStyle.clip = this.intact;
		this.contentStyle.opacity = 1;
		this.contentStyle.transition = 'clip .3s cubic-bezier(.4,0,.2,1),opacity .2s cubic-bezier(.4,0,.2,1)';
	}

	initAnimation(callback) {
		this.style = this.Popover.style;
		this.shadowStyle = this.Popover.children[0].style;
		this.contentStyle = this.Popover.children[1].style;

		this.style.height = this.Popover.children[1].clientHeight + 'px';
		this.style.visiblity = 'hidden';

		this.shadowStyle.transformOrigin = this.getTransformOrigin();
		this.shadowStyle.transform = 'scale(0)';
		this.shadowStyle.opacity = 0;

		this.contentStyle.clip = this.applyClip();
		this.contentStyle.opacity = 0;
		this.enterTimer = setTimeout(callback, 0);
	}

	applyClip() {
		const popover = this.Popover.children[1].getBoundingClientRect();
		const height = popover.height;
		const width = popover.width;
		
		this.intact = 'rect(0 ' + width + 'px ' + height + 'px ' + '0)';

		switch (this.props.alignment) {
			case 'BOTTOM_LEFT':
				return 'rect(0 ' + width + 'px ' + '0 '+ width + 'px)';
			case 'BOTOM_RIGHT':
				return 'rect(0 0 0 0)';
			case 'TOP_LEFT':
				return 'rect(' + height + 'px ' + width + 'px ' + height + 'px ' + width + 'px)';
			case 'TOP_RIGHT':
				return 'rect(' + height + 'px ' + '0 ' + height + 'px ' + '0)';
			default:
				return '';
		}
	}

	getTransformOrigin() {
		switch (this.props.alignment) {
			case 'BOTTOM_LEFT':
				return '100% 0';
			case 'BOTOM_RIGHT':
				return '0 0';
			case 'TOP_LEFT':
				return '100% 100%';
			case 'TOP_RIGHT':
				return '0 100%';
			default:
				return '';
		}
	}

	render() {
		const {items, onClickAway, hierarchy} = this.props;
		const lists = items.map((item, index) => {
			return (
				<li className="item" key={index}>
					<Ripple color="#bababa"/>
					{item}
				</li>
			)
		});

		return (
			<ClickAway onClickAway={onClickAway} hierarchy={hierarchy}>
				<div className="popover" ref={r => this.Popover = r}>
					<div className="shadow"></div>
					<ul className="menu">
						{lists}
					</ul>
				</div>
			</ClickAway>
		)
	}
}

class Popover extends Component {
	state = {
		open: false
	}

	toggle = () => {
		this.setState({open: !this.state.open});
	}

	removeAway = (e) => {
		this.setState({open: false});
	}

	render() {
		const {items, hierarchy, alignment} = this.props;

		return (
			<ReactTransitionGroup component="div">
				{this.state.open && 
					<TransitionItem 
						items={items}
						hierarchy={hierarchy}
						alignment={alignment}
						onClickAway={this.removeAway}
					/>}
			</ReactTransitionGroup>
		)
	}
}

export default Popover; 