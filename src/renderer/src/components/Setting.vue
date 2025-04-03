<template>
    <div v-if="show" :class="page.show ? 'setting-mask opacity':'setting-mask'"></div>
    <div v-if="show" :class="page.show ? 'setting-wrap opacity':'setting-wrap'">
        <div class="setting-inner">
            <div class="setting-header">
                <span class="title">{{t('setting.title')}}</span>
                <span class="iconfont icon-close" @click="onClose"></span>
            </div>
            <div class="setting-menu">
                <span :class="menu == 'general' ? 'active' : ''"  data-value="general" @click="onSwitchMenu">{{t('setting.general.title')}}</span>
                <span :class="menu == 'themes' ? 'active' : ''" data-value="themes" @click="onSwitchMenu">{{t('setting.theme.title')}}</span>
                <span :class="menu == 'about' ? 'active' : ''" data-value="about" @click="onSwitchMenu">{{t('setting.about.title')}}</span>
            </div>

            <div v-if="menu == 'themes'" class="setting-themes">
                <p>{{t('setting.theme.explain')}}</p>
                <div class="theme-box">
                    <div :class="theme == 'default' ? 'theme active' : 'theme'" data-value="default" @click="onSwitchTheme">
                        <svg width="192" height="106" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#555" d="M0 0h192v106H0z"></path><path fill="#fff" d="M-112-88h846v508h-846z"></path><rect x="-3" y="-3" width="198" height="148" rx="3" fill="#F2F2F2" stroke="#FFB400" stroke-width="2"></rect><mask id="a" maskUnits="userSpaceOnUse" x="0" y="0" width="96" height="106" style="mask-type: alpha;"><path fill="#A6A6A6" d="M0 0h96v106H0z"></path></mask><g mask="url(#a)"><path fill="#fff" d="M0 0h96v106H0z"></path><path fill="#fff" d="M0 0h192v107H0z"></path><g filter="url(#b)"><path fill="#F9F9F9" d="M0 0h48v107H0z"></path></g><g filter="url(#c)"><path fill="#fff" d="M0 0h192v10H0z"></path></g><rect x="3" y="3" width="4" height="4" rx="2" fill="#EC6A5E"></rect><rect x="9" y="3" width="4" height="4" rx="2" fill="#F5BF4F"></rect><rect x="15" y="3" width="4" height="4" rx="2" fill="#61C554"></rect><path d="M72 4a2 2 0 0 1 2-2h44a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H74a2 2 0 0 1-2-2V4ZM54 28a2 2 0 0 1 2-2h101a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H56a2 2 0 0 1-2-2v-4ZM23 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4ZM31 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4ZM54 17a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H55a1 1 0 0 1-1-1v-2Z" fill="#E6E6E6"></path><path d="M54 17a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1H54Z" fill="#FFB400"></path><path d="M71 17a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H72a1 1 0 0 1-1-1v-2ZM3 17a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2ZM11 17a1 1 0 0 1 1-1h32a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1v-2ZM3 25a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2ZM11 25a1 1 0 0 1 1-1h22a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1v-2ZM3 33a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2ZM11 33a1 1 0 0 1 1-1h26a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1v-2ZM3 41a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2ZM11 41a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1v-2ZM54 74a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-2ZM54 98a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-2ZM58 80a1 1 0 0 1 1-1h26a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H59a1 1 0 0 1-1-1v-2ZM58 86a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H59a1 1 0 0 1-1-1v-2ZM58 92a1 1 0 0 1 1-1h36a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H59a1 1 0 0 1-1-1v-2ZM54 66a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H55a1 1 0 0 1-1-1v-2Z" fill="#E6E6E6"></path><path d="M54 66a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1H54Z" fill="#FFB400"></path><path d="M71 66a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H72a1 1 0 0 1-1-1v-2Z" fill="#E6E6E6"></path><path fill="#E0E0E0" d="M48 58h144v.5H48z"></path></g><mask id="d" maskUnits="userSpaceOnUse" x="96" y="0" width="96" height="106" style="mask-type: alpha;"><path fill="#A6A6A6" d="M96 0h96v106H96z"></path></mask><g mask="url(#d)"><path fill="#212121" d="M96 0h96v106H96z"></path><path fill="#212121" d="M96 0h192v107H96z"></path><g filter="url(#e)"><path fill="#262626" d="M96 0h48v107H96z"></path></g><g filter="url(#f)"><path fill="#212121" d="M96 0h192v10H96z"></path></g><rect x="99" y="3" width="4" height="4" rx="2" fill="#EC6A5E"></rect><rect x="105" y="3" width="4" height="4" rx="2" fill="#F5BF4F"></rect><rect x="111" y="3" width="4" height="4" rx="2" fill="#61C554"></rect><path d="M168 4a2 2 0 0 1 2-2h44a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-44a2 2 0 0 1-2-2V4ZM150 28a2 2 0 0 1 2-2h101a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H152a2 2 0 0 1-2-2v-4ZM119 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4ZM127 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4ZM150 17a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-2Z" fill="#3B3B3B"></path><path d="M150 17a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1h-13Z" fill="#FFB400"></path><path d="M167 17a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-2ZM99 17a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2ZM107 17a1 1 0 0 1 1-1h32a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-32a1 1 0 0 1-1-1v-2ZM99 25a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2ZM107 25a1 1 0 0 1 1-1h22a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-22a1 1 0 0 1-1-1v-2ZM99 33a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2ZM107 33a1 1 0 0 1 1-1h26a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-26a1 1 0 0 1-1-1v-2ZM99 41a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2ZM107 41a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-18a1 1 0 0 1-1-1v-2ZM150 74a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-2ZM150 98a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-2ZM154 80a1 1 0 0 1 1-1h26a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-26a1 1 0 0 1-1-1v-2ZM154 86a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-18a1 1 0 0 1-1-1v-2ZM154 92a1 1 0 0 1 1-1h36a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-36a1 1 0 0 1-1-1v-2ZM150 66a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-2Z" fill="#3B3B3B"></path><path d="M150 66a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1h-13Z" fill="#FFB400"></path><path d="M167 66a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-2Z" fill="#3B3B3B"></path><path fill="#3C3C3C" d="M144 58h144v.5H144z"></path></g><defs><filter id="b" x="0" y="0" width="48.5" height="107" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dx=".5"></feOffset><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 0.878431 0 0 0 0 0.878431 0 0 0 0 0.878431 0 0 0 1 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1732_28633"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_1732_28633" result="shape"></feBlend></filter><filter id="c" x="0" y="0" width="192" height="10.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy=".5"></feOffset><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 0.878431 0 0 0 0 0.878431 0 0 0 0 0.878431 0 0 0 1 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1732_28633"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_1732_28633" result="shape"></feBlend></filter><filter id="e" x="96" y="0" width="48.5" height="107" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dx=".5"></feOffset><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1732_28633"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_1732_28633" result="shape"></feBlend></filter><filter id="f" x="96" y="0" width="192" height="10.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy=".5"></feOffset><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1732_28633"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_1732_28633" result="shape"></feBlend></filter></defs></svg>
                        <div><i :class="theme == 'default' ? 'iconfont icon-select' : 'iconfont icon-unselected'"> </i><em>{{t('setting.theme.default')}}</em></div>
                    </div>

                    <div :class="theme == 'light' ? 'theme active' : 'theme'" data-value="light" @click="onSwitchTheme">
                        <svg width="192" height="106" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#555" d="M0 0h192v106H0z"></path><path fill="#fff" d="M-336-88h846v508h-846z"></path><rect x="-4" y="-4" width="200" height="150" rx="4" fill="#F2F2F2"></rect><path fill="#fff" d="M0 0h192v106H0z"></path><g filter="url(#a)"><path fill="#F9F9F9" d="M0 0h48v106H0z"></path></g><g filter="url(#b)"><path fill="#fff" d="M0 0h192v10H0z"></path></g><rect x="3" y="3" width="4" height="4" rx="2" fill="#EC6A5E"></rect><rect x="9" y="3" width="4" height="4" rx="2" fill="#F5BF4F"></rect><rect x="15" y="3" width="4" height="4" rx="2" fill="#61C554"></rect><path d="M162 28a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-20a2 2 0 0 1-2-2v-4Z" fill="#0265D2"></path><path d="M72 4a2 2 0 0 1 2-2h44a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H74a2 2 0 0 1-2-2V4ZM54 28a2 2 0 0 1 2-2h101a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H56a2 2 0 0 1-2-2v-4ZM23 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4ZM31 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4ZM54 17a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H55a1 1 0 0 1-1-1v-2Z" fill="#E6E6E6"></path><path d="M54 17a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1H54Z" fill="#FFB400"></path><path d="M71 17a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H72a1 1 0 0 1-1-1v-2ZM3 17a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2ZM11 17a1 1 0 0 1 1-1h32a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1v-2ZM3 25a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2ZM11 25a1 1 0 0 1 1-1h22a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1v-2ZM3 33a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2ZM11 33a1 1 0 0 1 1-1h26a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1v-2ZM3 41a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2ZM11 41a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1v-2ZM54 74a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-2ZM54 98a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-2ZM58 80a1 1 0 0 1 1-1h26a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H59a1 1 0 0 1-1-1v-2ZM58 86a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H59a1 1 0 0 1-1-1v-2ZM58 92a1 1 0 0 1 1-1h36a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H59a1 1 0 0 1-1-1v-2ZM173 17a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-2ZM54 66a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H55a1 1 0 0 1-1-1v-2Z" fill="#E6E6E6"></path><path d="M54 66a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1H54Z" fill="#FFB400"></path><path d="M71 66a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H72a1 1 0 0 1-1-1v-2ZM173 66a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-2ZM183 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V4ZM175 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V4ZM167 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V4Z" fill="#E6E6E6"></path><path fill="#E0E0E0" d="M48 58h144v.5H48z"></path><defs><filter id="a" x="0" y="0" width="48.5" height="106" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dx=".5"></feOffset><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 0.878431 0 0 0 0 0.878431 0 0 0 0 0.878431 0 0 0 1 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1732_28633"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_1732_28633" result="shape"></feBlend></filter><filter id="b" x="0" y="0" width="192" height="10.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy=".5"></feOffset><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 0.878431 0 0 0 0 0.878431 0 0 0 0 0.878431 0 0 0 1 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1732_28633"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_1732_28633" result="shape"></feBlend></filter></defs></svg>
                        <div><i :class="theme == 'light' ? 'iconfont icon-select' : 'iconfont icon-unselected'"></i><em>{{t('setting.theme.light')}}</em></div>
                    </div>
                    <div :class="theme == 'dark' ? 'theme active' : 'theme'" data-value="dark" @click="onSwitchTheme">
                        <svg width="192" height="106" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#555" d="M0 0h192v106H0z"></path><path fill="#fff" d="M-560-88h846v508h-846z"></path><rect x="-4" y="-4" width="200" height="150" rx="4" fill="#F2F2F2"></rect><path fill="#E6E6E6" d="M0 0h192v106H0z"></path><path fill="#212121" d="M0 0h192v106H0z"></path><g filter="url(#a)"><path fill="#262626" d="M0 0h48v106H0z"></path></g><g filter="url(#b)"><path fill="#212121" d="M0 0h192v10H0z"></path></g><rect x="3" y="3" width="4" height="4" rx="2" fill="#EC6A5E"></rect><rect x="9" y="3" width="4" height="4" rx="2" fill="#F5BF4F"></rect><rect x="15" y="3" width="4" height="4" rx="2" fill="#61C554"></rect><path d="M162 28a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-20a2 2 0 0 1-2-2v-4Z" fill="#0265D2"></path><path d="M72 4a2 2 0 0 1 2-2h44a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H74a2 2 0 0 1-2-2V4ZM54 28a2 2 0 0 1 2-2h101a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H56a2 2 0 0 1-2-2v-4ZM23 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4ZM31 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4ZM54 17a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H55a1 1 0 0 1-1-1v-2Z" fill="#3B3B3B"></path><path d="M54 17a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1H54Z" fill="#FFB400"></path><path d="M71 17a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H72a1 1 0 0 1-1-1v-2ZM3 17a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2ZM11 17a1 1 0 0 1 1-1h32a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1v-2ZM3 25a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2ZM11 25a1 1 0 0 1 1-1h22a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1v-2ZM3 33a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2ZM11 33a1 1 0 0 1 1-1h26a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1v-2ZM3 41a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2ZM11 41a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1v-2ZM54 74a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-2ZM54 98a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-2ZM58 80a1 1 0 0 1 1-1h26a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H59a1 1 0 0 1-1-1v-2ZM58 86a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H59a1 1 0 0 1-1-1v-2ZM58 92a1 1 0 0 1 1-1h36a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H59a1 1 0 0 1-1-1v-2ZM173 17a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-2ZM54 66a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H55a1 1 0 0 1-1-1v-2Z" fill="#3B3B3B"></path><path d="M54 66a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1H54Z" fill="#FFB400"></path><path d="M71 66a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H72a1 1 0 0 1-1-1v-2ZM173 66a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-2ZM183 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V4ZM175 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V4ZM167 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V4Z" fill="#3B3B3B"></path><path fill="#3C3C3C" d="M48 58h144v.5H48z"></path><defs><filter id="a" x="0" y="0" width="48.5" height="106" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dx=".5"></feOffset><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 0.235294 0 0 0 0 0.235294 0 0 0 0 0.235294 0 0 0 1 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1732_28633"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_1732_28633" result="shape"></feBlend></filter><filter id="b" x="0" y="0" width="192" height="10.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy=".5"></feOffset><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 0.235294 0 0 0 0 0.235294 0 0 0 0 0.235294 0 0 0 1 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1732_28633"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_1732_28633" result="shape"></feBlend></filter></defs></svg>
                        <div><i :class="theme == 'dark' ? 'iconfont icon-select' : 'iconfont icon-unselected'"></i><em>{{t('setting.theme.dark')}}</em></div>
                    </div>
                </div>
            </div>

            <div v-if="menu == 'about'" class="setting-about">
                <img src="@renderer/assets/electron.svg" width="100" height="100" alt="comic++">
                <p>{{about.title}} for Windows</p>
                <p>Version {{about.version}}</p>
                <p>Architecture x64</p>

                <div class="link-box">
                    <p v-for="(item,index) of about.links" :key="index" class="link" :data-value="item.value" @click="onRedirect">
                        <em>{{item.name}}</em>
                        <i class="iconfont icon-arrow"></i>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">

import {useI18n} from 'vue-i18n';
import {ref, reactive, watch} from "vue";
import {Base,Common} from "@renderer/utils";
import type {PageInter, ConfirmInter} from "@renderer/utils/types";
import Confirm from "@renderer/components/Confirm.vue";

interface Props {
    show: boolean,
}

interface Page {
    show:boolean
}

interface About {
    title: string,
    version: string,
    architecture: string,
    links: { name: string, value: string }[]
}

const { t } = useI18n();
const emit = defineEmits(['cancel','setting'])
const props = defineProps<Props>()
const page:Page = reactive({show: true})
const confirm:ConfirmInter = reactive({show: false});
const menu:string = ref('general');
const theme:string = ref('default');
const about:About = reactive({
    title: import.meta.env.VITE_APP_TITLE,
    version: import.meta.env.VITE_APP_VERSION,
    architecture: 'x64',
    links: [
        {name: 'Weibo', value:'https://weibo.com/u/1892036735'},
        {name: 'Github', value:'https://github.com/keepsilent/electron-comic/'},
        {name: 'Documentation', value:'https://github.com/keepsilent/electron-comic/'}
    ]
})

const onRedirect = function ({currentTarget: {dataset: {value}}}) {
    Base.redirect(value,'_blank');
}

const onClose = function () {
    emit('hide')
}

const onSwitchMenu = function ({currentTarget: {dataset: {value}}}):boolean {
    menu.value = value
}

const onSwitchTheme = function ({currentTarget: {dataset: {value}}}):boolean {
    if(value == 'dark') {
        Common.showAlert(confirm,t('setting.theme.tips',{name:t('setting.theme.dark')}));
        return false;
    }
    theme.value = value
}

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

watch(() => props.show,(value)=>{
    menu.value = 'general';
    //延时显示，动画效果更佳
    setTimeout(()=> {page.show = value},10)
})
</script>

<style scoped lang="scss">
.setting {
    &-mask {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 5;
        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, 0.3);
        transition: opacity 0.25s ease-in-out;
        opacity: 0;
    }

    &-wrap {
        display: flex;
        align-items: center;
        justify-content: center;

        position: fixed;
        top: 0;
        left: 0;
        z-index: 6;
        width: 100%;
        height: 100%;

        transition: opacity 0.25s ease-in-out;
        opacity: 0;
    }

    &-inner {
        width: 720px;
        height: 524px;

        background: #FFF;
        border-radius: 8px;
        overflow: hidden;
    }

    &-header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-m);
        background: var(--background-color-secondary);

        color: var(--content-color-secondary);
        .title {
            margin-left: var(--spacing-s);
            font-size: var(--text-size-m);
            font-weight: var(--text-weight-medium);
            opacity: 0.95;
        }

        .icon-close {
            position: absolute;
            top: 6px;
            right: 10px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: var(--text-size-m);

            &:hover {
                color: var(--content-color-primary);
                background: var(--background-color-tertiary);
                border-radius: var(--border-radius-default);
            }
        }
    }

    &-menu {
        display: flex;
        align-items: center;
        font-size: var(--text-size-m);
        margin-top: var(--spacing-xs);
        padding: 0  var(--spacing-m);
        border-bottom: var(--border-width-default) var(--border-style-solid) var(--border-color-default);

        span {
            position: relative;

            display: block;

            margin: 0 var(--spacing-m);
            padding: var(--spacing-m) 0;


            text-align: center;
            cursor: pointer;
        }

        .active {
            &::after {
                content: '';
                position: absolute;
                left:0;
                bottom: -1px;
                width: 100%;
                border-bottom: var(--border-width-default) var(--border-style-solid) var(--base-color-brand);
                z-index: 1;
            }
        }
    }

    &-themes {
        margin-top: var(--spacing-xl);
        color: rgb(107, 107, 107);
        font-size: var(--text-size-m);
        text-align: center;


        .theme-box {
            display: flex;
            align-items: center;
            justify-content: space-between;

            margin-top: var(--spacing-xl);
            padding: 0 30px;
        }

        .theme {
            padding: var(--spacing-xs) var(--spacing-xs) 2px var(--spacing-xs);

            background-color: var(--background-color-tertiary);
            border-radius: var(--border-radius-default);
            cursor: pointer;
            div {
                display: flex;
                align-items: center;
                justify-items: center;

                padding: var(--spacing-xs) var(--spacing-xs);

                font-size: var(--text-size-m);
                .iconfont {
                    margin-right: var(--spacing-xxs);
                }

                .icon-select {
                    color: rgb(2, 101, 210);
                }
            }
        }

        .active {
            border: var(--border-width-l) var(--border-style-solid) var(--base-color-brand);
            padding: 2px 2px var(--spacing-zero) 2px;
        }

    }


    &-about {
        color: rgb(33, 33, 33);
        text-align: center;
        line-height: 2;

        img {
            padding-top: var(--spacing-xxl);
            padding-bottom: var(--spacing-l);
        }

        p {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-xxs) 0;
        }

        .link-box {
            padding-top: var(--spacing-s);
            .link {
                color: rgb(2, 101, 210);
                line-height: 1.5;
                cursor: pointer;

                .iconfont {
                    display: block;
                    font-size: var(--text-size-s);
                    transform: rotate(135deg);
                    margin-left: var(--spacing-xxs);
                }

                &:hover {
                }
            }
        }
    }
}

.opacity {
    opacity: 1;
}


</style>
