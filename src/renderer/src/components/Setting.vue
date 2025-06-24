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
                <span :class="menu == 'theme' ? 'active' : ''" data-value="theme" @click="onSwitchMenu">{{t('setting.theme.title')}}</span>
                <span :class="menu == 'shortcust' ? 'active' : ''" data-value="shortcust" @click="onSwitchMenu">{{t('setting.shortcust.title')}}</span>
                <span :class="menu == 'about' ? 'active' : ''" data-value="about" @click="onSwitchMenu">{{t('setting.about.title')}}</span>
            </div>
            <div v-if="menu == 'general'" class="setting-general">
                <div class="item">
                    <div class="title">
                        <span>{{t('setting.general.screen.title')}}</span>
                        <Select :select="window" @select="onSelectOption"></Select>
                    </div>
                    <p class="subtitle">{{t('setting.general.screen.subtitle')}}</p>
                </div>
                <div class="item">
                    <div class="title">
                        <span>{{t('setting.general.language.title')}}</span>
                        <Select :select="language" @select="onSelectOption"></Select>
                    </div>
                    <p class="subtitle">{{t('setting.general.language.subtitle')}}</p>
                </div>
                <div class="item">
                    <div class="title">
                        <span>{{t('setting.general.paging.title')}}</span>
                        <Select :select="pageing" @select="onSelectOption"></Select>
                    </div>
                    <p class="subtitle">{{t('setting.general.paging.subtitle')}}</p>
                </div>

                <div class="item">
                    <p class="title">{{t('setting.general.storage.title')}}</p>
                    <p class="subtitle pt-m" style="width: auto">{{t('setting.general.storage.subtitle')}}</p>
                    <div class="file-box">
                        <div class="input-wrap">
                            <div class="input-inner">
                                <input type="text" :value="general.path"  readonly="true">
                            </div>
                        </div>
                        <span class="btn btn-secondary btn-small" @click="onSelectFile">
                            {{t('setting.general.storage.button')}}
                        </span>
                    </div>
                </div>
            </div>

            <div v-if="menu == 'theme'" class="setting-themes">
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

            <div v-if="menu == 'shortcust'" class="setting-shortcust">

                <div class="setting-shortcust-header">
                    <span>{{t('setting.shortcust.title')}}</span>
                    <Switch :toggle="shortcuts"  @switch="onToggleSwitch"></Switch>
                </div>

                <div :class="shortcuts.value ? 'setting-shortcust-main' : 'setting-shortcust-main setting-shortcust-main__off'">
                    <dl class="item">
                        <dt>Interface</dt>
                        <dd>
                            <span class="name">Zoom In</span>
                            <span class="value">Ctrl + +</span>
                        </dd>
                        <dd>
                            <span class="name">Zoom Out</span>
                            <span class="value">Ctrl + -</span>
                        </dd>
                        <dd>
                            <span class="name">Reset Zoom</span>
                            <span class="value">Ctrl + 0</span>
                        </dd>
                    </dl>
                    <dl class="item">
                        <dt>DevTools</dt>
                        <dd>
                            <span class="name">Console</span>
                            <span class="value">Ctrl + Shift + I</span>
                        </dd>
                    </dl>
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
import {ref, reactive, onMounted, watch} from "vue";
import {Base,Config, Common} from "@renderer/utils";
import type {PageInter, ConfirmInter,SelectInter, switchInter} from "@renderer/utils/types";
import Confirm from "@renderer/components/Confirm.vue";
import {usePageStore} from '@renderer/stores/page'
import {useFileStore} from '@renderer/stores/file'

import Select from "./Select.vue";
import Switch from "./Switch.vue";

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

const { t, locale} = useI18n();
const emit = defineEmits(['hide','electron'])
const props = defineProps<Props>()
const pageStore = usePageStore();
const fileStore = useFileStore();
const page:Page = reactive({show: true})
const confirm:ConfirmInter = reactive({show: false});
const menu = ref('general');
const theme = ref('default');
const general:{path?:string} = reactive({
    path: Config.getStoragePath()
})
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

const window:SelectInter = reactive({
    key: 'window',
    name: localStorage.getItem('cm_setting_maximize') == 'true' ? t('setting.general.screen.maximize'): t('setting.general.screen.window'),
    value: localStorage.getItem('cm_setting_maximize') == 'true' ? 'maximize' : 'window',
    width: 105,
    options: [
        {name:t('setting.general.screen.window'),value: 'window'},
        {name:t('setting.general.screen.maximize'),value: 'maximize'},
    ]
})

const language:SelectInter = reactive({
    key: 'language',
    name: localStorage.getItem('cm_setting_locale') == 'zh'? '简体中文': 'English',
    value: localStorage.getItem('cm_setting_locale') == 'zh' ? 'zh': 'em',
    width: 105,
    options: [
        {name:'English',value: 'en'},
        {name:'简体中文',value: 'zh'},
    ]
})

const createPageingOptions = function ():{name:string,value:string}[]{
    const data = []
    for(let i = 20; i<= 100; i++) {
        let value = i.toString()
        data.push({name:value, value:value });
    }
    return data;
}

const pageing:SelectInter = reactive({
    key: 'pageing',
    name: localStorage.getItem('cm_setting_page_size') || '20',
    value: localStorage.getItem('cm_setting_page_size') || '20',
    width: 70,
    options: createPageingOptions()
})


const shortcuts:switchInter = reactive({
    key: 'shortcuts',
    value: localStorage.getItem('cm_setting_shortcuts') == 'false' ? false : true,
    options:[t('button.on'),t('button.off')]
})



const onRedirect = function (event) {
    const {currentTarget: {dataset: {value}}} = event
    Base.redirect(value,'_blank');
}

const onClose = function () {
    emit('hide')
}

const onSwitchMenu = function (event) {
    const {currentTarget: {dataset: {value}}} = event
    menu.value = value
}

const onSwitchTheme = function (event) {
    const {currentTarget: {dataset: {value}}} = event
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

const onSelectOption = function (option) {
    switch (option.key) {
        case 'window':
            window.name = option.name;
            window.value = option.value;
            changeWindow(option.value)
            break
        case 'language':
            language.name = option.name;
            language.value = option.value;
            changeLanguage(option.value);
            break
        case 'pageing':
            pageing.name = option.name;
            pageing.value = option.value;

            pageStore.pageSize = option.value;
            localStorage.setItem('cm_setting_page_size', option.value)
            break
    }
}

const changeWindow = function (value:string):boolean {
    const isMaximize = value == 'maximize' ? 1: 0;
    localStorage.setItem('cm_setting_maximize', isMaximize.toString())
    if(isMaximize == 1) {
        emit('electron',{key:'maximize'})
       //electron!.ipcRenderer.send('maximize');
        return false;
    }
    emit('electron',{key:'restore'})
    //electron!.ipcRenderer.send('restore');
    return true;
}

const changeLanguage = (value: string) => {
    locale.value = value
    localStorage.setItem('cm_setting_locale', value)
}

const onToggleSwitch = function (option) {
    switch (option.key) {
        case 'shortcuts':
            shortcuts.value = option.value;
            localStorage.setItem('cm_setting_shortcuts', option.value)
            break
    }
}

const onSelectFile = function () {
    emit('electron',{key:'openDialog',data:general.path})
   //electron!.ipcRenderer.send('openDialog',general.path);
}



watch(() => props.show,(value)=>{
    menu.value = 'general';
    //延时显示，动画效果更佳
    setTimeout(()=> {page.show = value},10)
})

watch(() => fileStore.path,(value)=>{
    general.path = value;
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
        transition: opacity var(--transition-delay-default) var(--transition-timing-default);;
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

        transition: opacity var(--transition-delay-default) var(--transition-timing-default);;
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
            padding: var(--spacing-xs) 0;
            margin-left: var(--spacing-s);
            color: var(--content-color-secondary);
            font-size: var(--text-size-m);
            font-weight: var(--text-weight-medium);
            opacity: 1;
        }

        .icon-close {
            position: absolute;
            top: 7px;
            right: 10px;
            cursor: pointer;
            width: 36px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            font-size: var(--text-size-m);
            font-weight: var(--text-weight-medium);

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
        margin-top: var(--spacing-s);
        padding: 0  var(--spacing-m);
        border-bottom: var(--border-width-default) var(--border-style-solid) var(--border-color-default);

        span {
            position: relative;

            display: block;

            margin: 0 var(--spacing-m);
            padding: var(--spacing-m) 0;
            color: var(--content-color-secondary);


            text-align: center;
            cursor: pointer;
            &:hover {
                color: var(--content-color-primary);
            }
        }

        .active {
            color: var(--content-color-primary);
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

    &-general {
        width: 450px;
        padding: var(--spacing-l);

        .item {
            width: 400px;
            margin-right: var(--spacing-l);
            padding: 10px 15px;
            .title {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                color: var(--content-color-primary);
                font-weight: var(--text-weight-medium);
            }

            .subtitle {
                width: 280px;
                margin-top: -10px;
                color: rgba(107,107,107,1);
                line-height: 1.6;
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

            color: var(--content-color-primary);
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

    &-shortcust {

        &-header {
            display: flex;
            align-items: center;
            justify-content: space-between;

            margin: var(--spacing-s) var(--spacing-xxl)  var(--spacing-xxl);
            padding: var(--spacing-xl) 0;
            color: var(--content-color-primary);

            font-size: var(--text-size-m);
            line-height: var(--line-height-m);
            font-weight: 600;
            border-bottom: var(--border-style-solid) var(--border-width-default) var(--border-color-default);
        }

        &-main {

            .item {
                width: 600px;
                margin-left: var(--spacing-xxl);
                padding-bottom: var(--spacing-xl);

                dt {
                    padding-bottom: var(--spacing-s);
                    color: var(--content-color-primary);
                    font-weight: var(--text-weight-medium);
                }

                dd {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: rgba(107, 107, 107, 1);
                    line-height: 2.5;

                    .value {
                        width: 180px;
                    }
                }
            }
        }

        &-main__off {
            .item {
                dt {color: var(--content-color-secondary)};
                dd {color: var(--content-color-tertiary)};
            }
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

//.input-select-wrap {
//    width: 90px;
//}

.file-box {
    width:  400px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: var(--spacing-s);
}
</style>
