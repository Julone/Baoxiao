<template>
    <keep-alive :include="['bill_split']">
        <router-view></router-view>
    </keep-alive>
</template>