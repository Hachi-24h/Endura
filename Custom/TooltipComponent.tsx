import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ViewStyle } from 'react-native';

type TooltipProps = {
    visible: boolean;
    onClose: () => void;
    content: string | ReactNode;
    position?: {
        top: number;
        left: number;
    };
};

const TooltipComponent: React.FC<TooltipProps> = ({ visible, onClose, content, position = { top: 0, left: 0 } }) => {
    if (!visible) return null;

    return (
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={[styles.container, position]}>
                <View style={styles.tooltipBox}>
                    {typeof content === 'string' ? (
                        <Text style={styles.text}>{content}</Text>
                    ) : (
                        content
                    )}
                </View>
                <View style={styles.arrow} />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 1000,
    } as ViewStyle,
    tooltipBox: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        borderRadius: 5,
        maxWidth: 200,
    },
    text: {
        color: '#fff',
        fontSize: 14,
    },
    arrow: {
        width: 10,
        height: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'absolute',
        top: -5,
        left: '50%',
        marginLeft: -5,
        transform: [{ rotate: '45deg' }],
    },
});

export default TooltipComponent;
