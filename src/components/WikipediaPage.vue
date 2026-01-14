<template>
  <div
    ref="pageRoot"
    :class="[
      isEditMode ? 'edit-mode' : 'read-mode',
      isMinervaSkin ? 'minerva-skin' : 'vector-skin',
      isMinervaSkin && isEditMode && showSuggestions && !showEmptyState ? 'minerva-suggestions-on' : '',
      isMinervaSheetOpen ? 'minerva-sheet-open' : '',
      isSuggestionLightFlash ? 'suggestion-light-flash' : ''
    ]"
  >
    <!-- Page Container -->
    <div class="page-container">
      
      <!-- Header -->
      <header class="header-section" :class="{ 'header-section--minerva': isMinervaSkin }">
        <div v-if="!isMinervaSkin" class="header">
          <!-- Menu Button -->
          <button class="menu-button" aria-label="Menu" @click="toggleSkinMenu">
            <cdx-icon :icon="cdxIconMenu" size="medium" />
          </button>
          <div v-if="isSkinMenuOpen && !isEditMode" class="menu-popup" role="dialog" aria-label="Skin menu">
            <label class="menu-radio">
              <input type="radio" name="skin" value="vector22" v-model="selectedSkin" @change="isSkinMenuOpen = false">
              <span>Vector22</span>
            </label>
            <label class="menu-radio">
              <input type="radio" name="skin" value="minerva" v-model="selectedSkin" @change="isSkinMenuOpen = false">
              <span>Minerva (mobile skin)</span>
            </label>
          </div>

          <!-- Wikipedia Logo -->
          <div class="wikipedia-logo">
            <img :src="wikipediaGlobe" alt="Wikipedia globe" class="wikipedia-globe" />
            <div class="wikipedia-text">
              <div class="wikipedia-title">WIKIPEDIA</div>
              <div class="wikipedia-tagline">The Free Encyclopedia</div>
            </div>
          </div>

          <!-- Search -->
          <div class="search-container">
            <cdx-typeahead-search
              id="typeahead-search-wikipedia"
              form-action="https://en.wikipedia.org/w/index.php"
              :use-button="true"
              :search-results="searchResults"
              :search-footer-url="searchFooterUrl"
              :show-thumbnail="true"
              :highlight-query="true"
              :auto-expand-width="true"
              placeholder="Search"
              @input="onSearchInput"
              @search-result-click="onSearchResultClick"
              @submit="onSearchSubmit"
            >
              <template #default>
                <input type="hidden" name="language" value="en">
                <input type="hidden" name="title" value="Special:Search">
              </template>
              <template #search-footer-text="{ searchQuery }">
                Search Wikipedia for pages containing
                <strong class="cdx-typeahead-search__search-footer__query">
                  {{ searchQuery }}
                </strong>
              </template>
            </cdx-typeahead-search>
          </div>

          <!-- User Tools -->
          <div class="user-tools">
            <a href="#" class="user-link">User1234</a>
            <button class="icon-btn" aria-label="Notifications">
              <cdx-icon :icon="cdxIconBell" size="medium" />
            </button>
            <button class="icon-btn" aria-label="Messages">
              <cdx-icon :icon="cdxIconTray" size="medium" />
            </button>
            <button class="icon-btn" aria-label="Watchlist">
              <cdx-icon :icon="cdxIconWatchlist" size="medium" />
            </button>
            <button class="user-menu-btn" aria-label="User menu">
              <cdx-icon :icon="cdxIconUserAvatar" size="medium" />
              <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
            </button>
          </div>
        </div>

        <div v-else class="header header--minerva">
          <div class="minerva-header-left">
            <button class="menu-button menu-button--minerva" aria-label="Menu" @click="toggleSkinMenu">
              <cdx-icon :icon="cdxIconMenu" size="medium" />
            </button>
            <div v-if="isSkinMenuOpen && !isEditMode" class="menu-popup menu-popup--minerva" role="dialog" aria-label="Skin menu">
              <label class="menu-radio">
                <input type="radio" name="skin" value="vector22" v-model="selectedSkin" @change="isSkinMenuOpen = false">
                <span>Vector22</span>
              </label>
              <label class="menu-radio">
                <input type="radio" name="skin" value="minerva" v-model="selectedSkin" @change="isSkinMenuOpen = false">
                <span>Minerva (mobile skin)</span>
              </label>
            </div>

            <div class="minerva-brand">
              <span class="minerva-brand-text">Wikipedia</span>
            </div>
          </div>

          <div class="minerva-header-actions">
            <button class="icon-btn" aria-label="Search">
              <cdx-icon :icon="cdxIconSearch" size="medium" />
            </button>
            <button class="icon-btn" aria-label="Notifications">
              <cdx-icon :icon="cdxIconBell" size="medium" />
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <div
        class="main-content-area"
        :class="{ 'has-suggestions': showSuggestions && (availableSuggestionCount > 0 || showSuggestionBadge) }"
      >
        
        <!-- Table of Contents (Left Sidebar) - Only visible in Read mode -->
        <aside v-if="!isEditMode" class="toc-sidebar">
          <div class="toc-container">
            <div class="toc-header">
              <h2 class="toc-title">Contents</h2>
              <button class="toc-toggle">hide</button>
            </div>
            
            <nav class="toc-nav">
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link toc-link-bold">(Top)</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Early life</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Career</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Poetry</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Prose</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Film</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Theory</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Lorde and womanism</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Personal life</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Last years</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Honors</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Legacy</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Works</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">See also</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Notes</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">References</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Further reading</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">External links</a>
              </div>
            </nav>
          </div>
        </aside>

        <!-- Article Content (Center) -->
        <article class="article">
          <div class="article-chrome">
            <!-- Title and Toolbar -->
            <div v-if="!isMinervaSkin" class="title-toolbar">
              <div class="article-title-section">
                <div class="title-and-language">
                  <button class="toc-toggle-btn" aria-label="Toggle table of contents">
                    <cdx-icon :icon="cdxIconListBullet" size="medium" />
                  </button>
                  <h1 class="article-title">Audre Lorde</h1>
                  <button class="language-button">
                    <cdx-icon :icon="cdxIconLanguage" size="medium" class="language-icon" />
                    <span class="language-text">95 Languages</span>
                    <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-small" />
                  </button>
                </div>
                <div class="title-divider"></div>
              </div>

              <div class="toolbar">
                <div class="tabs">
                  <div class="tabs-start">
                    <div class="tab tab-selected">
                      <span class="tab-text">Article</span>
                      <div class="tab-indicator"></div>
                    </div>
                    <div class="tab">
                      <span class="tab-text tab-link">Talk</span>
                    </div>
                  </div>
                  
                  <div class="tabs-end">
                    <div class="tab" :class="{ 'tab-selected': !isEditMode }" @click="handleReadClick">
                      <span class="tab-text" :class="{ 'tab-link': isEditMode }">Read</span>
                      <div v-if="!isEditMode" class="tab-indicator"></div>
                    </div>
                    <div class="tab" :class="{ 'tab-selected': isEditMode }" @click="toggleEditMode">
                      <span class="tab-text" :class="{ 'tab-link': !isEditMode }">Edit</span>
                      <div v-if="isEditMode" class="tab-indicator"></div>
                    </div>
                    <div class="tab">
                      <span class="tab-text tab-link">View history</span>
                    </div>
                    <button class="tab-icon-btn">
                      <cdx-icon :icon="cdxIconStar" size="medium" />
                    </button>
                    <button class="tools-toggle-btn" aria-label="Toggle tools">
                      <span class="tools-toggle-text">Tools</span>
                      <cdx-icon :icon="cdxIconExpand" size="small" />
                    </button>
                  </div>
                </div>
                <div class="toolbar-divider"></div>
              </div>
            </div>

            <div v-else-if="!isEditMode" class="minerva-title-toolbar">
              <div class="minerva-title-row">
                <h1 class="minerva-article-title">Audre Lorde</h1>
                <button class="minerva-language-button" aria-label="Language options">
                  <cdx-icon :icon="cdxIconLanguage" size="medium" />
                </button>
              </div>
              <div class="minerva-tabs">
                <button class="minerva-tab minerva-tab--active">
                  Article
                </button>
                <button class="minerva-tab">
                  Talk
                </button>
              </div>
              <div class="minerva-actions">
                <button class="minerva-action-btn" aria-label="Language">
                  <cdx-icon :icon="cdxIconLanguage" size="medium" />
                </button>
                <button class="minerva-action-btn" aria-label="Watch">
                  <cdx-icon :icon="cdxIconWatchlist" size="medium" />
                </button>
                <button class="minerva-action-btn" aria-label="History">
                  <cdx-icon :icon="cdxIconHistory" size="medium" />
                </button>
                <button class="minerva-action-btn" aria-label="Edit" @click="toggleEditMode">
                  <cdx-icon :icon="cdxIconEdit" size="medium" />
                </button>
                <button class="minerva-action-btn" aria-label="More actions">
                  <cdx-icon :icon="cdxIconEllipsis" size="medium" class="minerva-ellipsis-icon" />
                </button>
              </div>
            </div>

            <p v-if="!isEditMode && !isMinervaSkin" class="article-tagline">From Wikipedia, the free encyclopedia</p>
            <p v-else-if="!isEditMode && isMinervaSkin" class="article-tagline article-tagline--minerva">From Wikipedia, the free encyclopedia</p>
          </div>

          <!-- Article Content -->
          <div v-if="!isEditMode && !isMinervaSkin" class="article-content-section">
            <div class="article-ve-contents">
              <div class="article-content-grid">
                <!-- Main Article Text -->
                <div class="article-text">
                  <div class="intro-text">
                    <p>
                      <strong>Audre Lorde</strong> (<a href="#">/ˈɔːdri ˈlɔːrd/</a> <em>AW-dree LORD</em>; born <strong>Audrey Geraldine Lorde</strong>; February 18, 1934 – November 17, 1992) was an American writer, professor, philosopher, intersectional <a href="#">feminist</a>, <a href="#">poet</a> and <a href="#">civil rights activist</a>. She was a self-described "Black, lesbian, feminist, socialist, mother, warrior, poet" who dedicated her life and talents to confronting different forms of injustice, as she believed there could be "no hierarchy of oppressions" among "those who share the goals of liberation and a workable future for our children".
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      As a poet, she is well known for technical mastery and emotional expression, as well as her poems that express anger and outrage at civil and social injustices she observed throughout her life. She was the recipient of national and international awards and the founding member of <em>Kitchen Table: Women of Color Press</em>. As a <a href="#">spoken word</a> artist, her delivery has been called powerful, melodic, and intense by the Poetry Foundation. Her poems and prose largely deal with issues related to civil rights, feminism, lesbianism, illness, disability, and the exploration of Black female identity.
                    </p>
                  </div>

                  <!-- Early Life Section -->
                  <div class="section-heading">
                    <div class="section-heading-row">
                      <h2 class="heading-text">Early life</h2>
                      <span class="section-edit">
                        <span class="section-edit-bracket">[</span><a href="#" class="section-edit-link" @click.prevent="openEditAtSection('early-life')">edit</a><span class="section-edit-bracket">]</span>
                      </span>
                    </div>
                    <div class="heading-divider"></div>
                  </div>

                  <div class="body-text">
                    <p>
                      Audre Lorde was born on February 18, 1934, in <a href="#">New York City</a> to Caribbean immigrants Frederick Byron Lorde and Linda Gertrude Belmar Lorde. Her father, Frederick Byron Lorde (Byron), was born on April 20, 1898, in <a href="#">Barbados</a>. Her mother, Linda Gertrude Belmar Lorde, was born in 1902 on the island <a href="#">Carriacou</a> in <a href="#">Grenada</a>. Lorde's mother was a light-skinned Black woman but sometimes passed as Spanish, for employment opportunities. Lorde's father was darker than the Belmar family liked, and they only allowed the couple to marry because of Byron's charm, ambition, and persistence. After their immigration, the new family settled in <a href="#">Harlem</a>, a diverse neighborhood in upper Manhattan, New York. Lorde was the youngest of three daughters. Lorde was nearsighted to the point of being legally blind. At the age of four she learned to read at the same time she learned to talk, with the help of Augusta Braxton Baker, then children's librarian at the 135th Street Branch of the New York Public Library. Her mother taught her to write at around the same time.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Born Audrey Geraldine Lorde, she chose to drop the "y" from her first name while still a child, explaining in <em><a href="#">Zami: A New Spelling of My Name</a></em> that she was more interested in the artistic symmetry of the "e"-endings in the two side-by-side names "Audre Lorde" than in spelling her name the way her parents had intended.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Lorde's relationship with her parents was difficult from a young age. She spent very little time with her father and mother, who were both busy maintaining their property management business in the tumultuous economy after <a href="#">the Great Depression</a>. When she did see them, they were often cold or emotionally distant. In particular, Lorde's relationship with her mother, who was deeply suspicious of people with darker skin than hers (which Lorde had) and the outside world in general, was characterized by "tough love" and strict adherence to family rules. Lorde's difficult relationship with her mother figured prominently in her later poems, such as <em>Coal</em>'s "Story Books on a Kitchen Table"
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      As a child, Lorde struggled with communication, and came to appreciate the power of poetry as a form of expression. She even described herself as thinking in poetry, stating that she would always "see things in terms of poetry". She explains that it was a way for her to understand and articulate her feelings. She went on to state that it was her way of "birthing myself into a world that I could bring into myself".
                    </p>
                  </div>
                </div>

                <!-- Infobox -->
                <aside class="infobox">
                  <div class="infobox-title">Audre Lorde</div>
                  
                  <div class="infobox-image-section">
                    <div class="infobox-image">
                      <img :src="audreImage" alt="Audre Lorde in 1980" />
                    </div>
                    <div class="infobox-caption">Lorde in 1980</div>
                  </div>

                  <div class="infobox-row">
                    <div class="infobox-label">Born</div>
                    <div class="infobox-value">
                      Audrey Geraldine Lorde<br>
                      February 18, 1934[1]<br>
                      <a href="#">New York City</a>, U.S.
                    </div>
                  </div>

                  <div class="infobox-row infobox-row-faded">
                    <div class="infobox-label">Died</div>
                    <div class="infobox-value">
                      November 17, 1992 (aged 58)<br>
                      <a href="#">Saint Croix, Virgin Islands</a>, U.S.
                    </div>
                  </div>

                  <div class="infobox-row">
                    <div class="infobox-label">Education</div>
                    <div class="infobox-value infobox-value-link">
                      <a href="#">National Autonomous University of Mexico</a><br>
                      <a href="#">Hunter College (BA)</a><br>
                      <a href="#">Columbia University (MLS)</a>
                    </div>
                  </div>

                  <div class="infobox-row">
                    <div class="infobox-label">Genre</div>
                    <div class="infobox-value">
                      Poetry<br>
                      Nonfiction
                    </div>
                  </div>

                  <div class="infobox-row">
                    <div class="infobox-label">Notable works</div>
                    <div class="infobox-value infobox-value-link">
                      The First Cities<br>
                      <a href="#">Zami: A New Spelling of My Name</a><br>
                      <a href="#">The Cancer Journals</a>
                    </div>
                  </div>
                </aside>
              </div>
            </div>

            <!-- Career Section -->
            <div class="section-heading">
              <div class="section-heading-row">
                <h2 class="heading-text">Career</h2>
                <span class="section-edit">
                  <span class="section-edit-bracket">[</span><a href="#" class="section-edit-link" @click.prevent="openEditAtSection('career')">edit</a><span class="section-edit-bracket">]</span>
                </span>
              </div>
              <div class="heading-divider"></div>
            </div>

            <div class="body-text">
              <p>
                In 1954, she spent a pivotal year as a student at the <a href="#">National Autonomous University of Mexico</a>, a period she described as a time of affirmation and renewal. During this time, she confirmed her identity on personal and artistic levels as both a lesbian and a poet. On her return to New York, Lorde attended <a href="#">Hunter College</a>, and graduated in the class of 1959. While there, she worked as a librarian, continued writing, and became an active participant in the <a href="#">gay culture</a> of <a href="#">Greenwich Village</a>. She furthered her education at the <a href="#">Columbia University School of Library Service</a>, earning a master's degree in <a href="#">library science</a> in 1961. During this period, she worked as a public librarian in nearby <a href="#">Mount Vernon, New York</a>.
              </p>
              <p>&nbsp;</p>
              <p>
                In 1968 Lorde was writer-in-residence at <a href="#">Tougaloo College</a> in Mississippi. Lorde's time at Tougaloo College, like her year at the <a href="#">National University of Mexico</a>, was a formative experience for her as an artist. She led workshops with her young, black undergraduate students, many of whom were eager to discuss the <a href="#">civil rights</a> issues of that time. Through these discussions with her students, she reaffirmed her desire not only to live out her "crazy and queer" identity, but also to devote attention to the formal aspects of her craft as a poet. Her book of poems, <em>Cables to Rage</em>, came out of her time and experiences at Tougaloo.
              </p>
              <p>&nbsp;</p>
              <p>
                From 1972 to 1987, Lorde resided on <a href="#">Staten Island</a>. During that time, in addition to writing and teaching she co-founded <a href="#">Kitchen Table: Women of Color Press</a>.
              </p>
              <p>&nbsp;</p>
              <p>
                In 1977, Lorde became an associate of the <a href="#">Women's Institute for Freedom of the Press</a> (WIFP). WIFP is an American nonprofit publishing organization. The organization works to increase communication between women and connect the public with forms of women-based media.
              </p>
              <p>&nbsp;</p>
              <p>
                Lorde taught in the Education Department at <a href="#">Lehman College</a> from 1969 to 1970, then as a professor of English at <a href="#">John Jay College of Criminal Justice</a> (both part of the <a href="#">City University of New York</a>, CUNY) from 1970 to 1981. There, she fought for the creation of a <a href="#">black studies</a> department. In 1981, she went on to teach at her alma mater, <a href="#">Hunter College</a> (also CUNY), as the distinguished Thomas Hunter chair. As a queer Black woman, she was an outsider in a <a href="#">white male</a> dominated field and her experiences in this environment deeply influenced her work. New fields such as <a href="#">African American studies</a> and <a href="#">women's studies</a> advanced the topics that scholars were addressing and garnered attention to groups that had previously been rarely discussed. With this newfound <a href="#">academic</a> environment, Lorde was inspired to not only write poetry but also essays and articles about queer, feminist, and African American studies.
              </p>
              <p>&nbsp;</p>
              <p>
                In 1980, together with <a href="#">Barbara Smith</a> and <a href="#">Cherríe Moraga</a>, she co-founded <a href="#">Kitchen Table: Women of Color Press</a>, the first U.S. publisher for women of color.
              </p>
              <p>&nbsp;</p>
              <p>
                In 1981, Lorde was among the founders of the Women's Coalition of St. Croix, an organization dedicated to assisting women who have survived sexual abuse and <a href="#">intimate partner violence</a>. In the late 1980s, she also helped establish Sisterhood in Support of Sisters (SISA) in South Africa to benefit black women who were affected by <a href="#">apartheid</a> and other forms of injustice.
              </p>
              <p>&nbsp;</p>
              <p>
                In 1985, Audre Lorde was a part of a delegation of <a href="#">black women</a> writers who had been invited to <a href="#">Cuba</a>. The trip was sponsored by <em>The Black Scholar</em> and the Union of Cuban Writers. She embraced the shared sisterhood as black women writers. They visited Cuban poets <a href="#">Nancy Morejón</a> and <a href="#">Nicolas Guillén</a>. They discussed whether the Cuban revolution had truly changed racism and the status of lesbians and gays there.
              </p>
            </div>

            <!-- Poetry Section -->
            <div class="section-heading">
              <div class="section-heading-row">
                <h2 class="heading-text">Poetry</h2>
                <span class="section-edit">
                  <span class="section-edit-bracket">[</span><a href="#" class="section-edit-link" @click.prevent="openEditAtSection('poetry')">edit</a><span class="section-edit-bracket">]</span>
                </span>
              </div>
              <div class="heading-divider"></div>
            </div>

            <div class="body-text">
              <p>
                Lorde focused her discussion of difference not only on differences between groups of women but between conflicting differences within the individual. "I am defined as other in every group I'm part of," she declared. "Yet without community," Lorde wrote, "there is certainly no liberation, no future, only the most vulnerable and temporary armistice between me and my oppression". She described herself both as a part of a "continuum of women" and a "concert of voices" within herself.
              </p>
              <p>&nbsp;</p>
              <p>
                Her conception of her many layers of selfhood is replicated in the multi-genres of her work. Critic Carmen Birkle wrote: "Her multicultural self is thus reflected in a multicultural text, in multi-genres, in which the individual cultures are no longer separate and autonomous entities but melt into a larger whole without losing their individual importance." Her refusal to be placed in a particular category, whether social or literary, was characteristic of her determination to come across as an individual rather than a stereotype. Lorde considered herself a "lesbian, mother, warrior, poet" and used poetry to get this message across.
              </p>
              <p>&nbsp;</p>
              <p><strong>Early works</strong></p>
              <p>&nbsp;</p>
              <p>
                Lorde's poetry was published very regularly during the 1960s - in Langston Hughes' 1962 New Negro Poets, USA; in several foreign anthologies; and in black literary magazines. During this time, she was also politically active in civil rights, anti-war, and feminist movements.
              </p>
              <p>&nbsp;</p>
              <p>
                In 1968, Lorde published The First Cities, her first volume of poems. It was edited by Diane di Prima, a former classmate and friend from Hunter College High School. The First Cities has been described as a "quiet, introspective book", and Dudley Randall, a poet and critic, asserted in his review of the book that Lorde "does not wave a black flag, but her Blackness is there, implicit, in the bone".
              </p>
              <p>&nbsp;</p>
              <p>
                Her second volume, Cables to Rage (1970), which was mainly written during her tenure as poet-in-residence at Tougaloo College in Mississippi, addressed themes of love, betrayal, childbirth, and the complexities of raising children. It is particularly noteworthy for the poem "Martha", in which Lorde openly confirms her homosexuality for the first time in her writing: "[W]e shall love each other here if ever at all".
              </p>
              <p>&nbsp;</p>
              <p>
                Nominated for the National Book Award for poetry in 1974, From a Land Where Other People Live (Broadside Press) shows Lorde's personal struggles with identity and anger at social injustice. The volume deals with themes of anger, loneliness, and injustice, as well as what it means to be a black woman, mother, friend, and lover.
              </p>
              <p>&nbsp;</p>
              <p>
                1974 saw the release of New York Head Shop and Museum, which gives a picture of Lorde's New York through the lenses of both the civil rights movement and her own restricted childhood: stricken with poverty and neglect and, in Lorde's opinion, in need of political action.
              </p>
              <p>&nbsp;</p>
              <p><strong>Wider recognition</strong></p>
              <p>&nbsp;</p>
              <p>
                Despite the success of these volumes, it was the release of Coal in 1976 that established Lorde as an influential voice in the Black Arts Movement, and the large publishing house behind it - Norton - helped introduce her to a wider audience. The volume includes poems from both The First Cities and Cables to Rage, and it unites many of the themes Lorde would become known for throughout her career: her rage at racial injustice, her celebration of her black identity, and her call for an intersectional consideration of women's experiences. Lorde followed Coal up with Between Our Selves (also in 1976) and Hanging Fire (1978).
              </p>
              <p>&nbsp;</p>
              <p>
                In Lorde's volume The Black Unicorn (1978), she describes her identity within the mythos of African female deities of creation, fertility, and warrior strength. This reclamation of African female identity both builds and challenges existing Black Arts ideas about pan-Africanism. While writers like Amiri Baraka and Ishmael Reed utilized African cosmology in a way that "furnished a repertoire of bold male gods capable of forging and defending an aboriginal Black universe," in Lorde's writing "that warrior ethos is transferred to a female vanguard capable equally of force and fertility".
              </p>
              <p>&nbsp;</p>
              <p>
                Lorde's poetry became more open and personal as she grew older and became more confident in her sexuality. In Sister Outsider: Essays and Speeches, Lorde states, "Poetry is the way we help give name to the nameless so it can be thought... As they become known to and accepted by us, our feelings and the honest exploration of them become sanctuaries and spawning grounds for the most radical and daring ideas." Sister Outsider also elaborates Lorde's challenge to European-American traditions.
              </p>
            </div>

            <!-- Prose Section -->
            <div class="section-heading">
              <div class="section-heading-row">
                <h2 class="heading-text">Prose</h2>
                <span class="section-edit">
                  <span class="section-edit-bracket">[</span><a href="#" class="section-edit-link" @click.prevent="openEditAtSection('prose')">edit</a><span class="section-edit-bracket">]</span>
                </span>
              </div>
              <div class="heading-divider"></div>
            </div>

            <div class="body-text">
              <p>
                The Cancer Journals (1980) and A Burst of Light (1988) both use non-fiction prose, including essays and journal entries, to bear witness to, explore, and reflect on Lorde's diagnosis, treatment, recovery from breast cancer, and ultimately fatal recurrence with liver metastases. In both works, Lorde deals with Western notions of illness, disability, treatment, cancer and sexuality, and physical beauty and prosthesis, as well as themes of death, fear of mortality, survival, emotional healing, and inner power.
              </p>
              <p>&nbsp;</p>
              <p>
                Lorde's deeply personal book Zami: A New Spelling of My Name (1982), subtitled a "biomythography", chronicles her childhood and adulthood. The narrative deals with the evolution of Lorde's sexuality and self-awareness.
              </p>
              <p>&nbsp;</p>
              <p><strong>Sister Outsider</strong></p>
              <p>&nbsp;</p>
              <p>
                In Sister Outsider: Essays and Speeches (1984), Lorde asserts the necessity of communicating the experience of marginalized groups to make their struggles visible in a repressive society. She emphasizes the need for different groups of people (particularly white women and African-American women) to find common ground in their experiences in life, but also to face difference directly, and use it as a source of strength rather than alienation. She repeatedly emphasizes the need for community in the struggle to build a better world. How to constructively channel the anger and rage incited by oppression is another prominent theme throughout her works, and in this collection in particular.
              </p>
              <p>&nbsp;</p>
              <p>
                Her most famous essay, "The Master's Tools Will Never Dismantle the Master's House", is included in Sister Outsider. Lorde questions the scope and ability for change to be instigated when examining problems through a racist, patriarchal lens. She insists that women see differences between other women not as something to be tolerated, but something that is necessary to generate power and to actively "be" in the world. This will create a community that embraces differences, which will ultimately lead to liberation. Lorde elucidates, "Divide and conquer, in our world, must become define and empower." Also, people must educate themselves about the oppression of others because expecting a marginalized group to educate the oppressors is the continuation of racist, patriarchal thought. She explains that this is a major tool utilized by oppressors to keep the oppressed occupied with the master's concerns. She concludes that to bring about real change, we cannot work within the racist, patriarchal framework because change brought about in that will not remain.
              </p>
              <p>&nbsp;</p>
              <p>
                Also in Sister Outsider is the essay, "The Transformation of Silence into Language and Action". Lorde discusses the importance of speaking, even when afraid, because otherwise silence immobilizes and chokes us. Many people fear to speak the truth because of the real risks of retaliation, but Lorde warns, "Your silence does not protect you." Lorde emphasizes that "the transformation of silence into language and action is a self-revelation, and that always seems fraught with danger." People are afraid of others' reactions for speaking, but mostly for demanding visibility, which is essential to live. Lorde adds, "We can sit in our corners mute forever while our sisters and ourselves are wasted, while our children are distorted and destroyed, while our earth is poisoned; we can sit in our safe corners mute as bottles, and we will still be no less afraid." "People are taught to respect their fear of speaking more than silence, but ultimately, the silence will choke us anyway, so we might as well speak the truth." Lorde writes that we can learn to speak even when we are afraid.
              </p>
              <p>&nbsp;</p>
              <p>
                In "Age, Race, Class, and Sex: Women Redefining Difference", Lorde emphasizes the importance of educating others. However, she stresses that in order to educate others, one must first be educated. Empowering people who are doing the work does not mean using privilege to overstep and overpower such groups; but rather, privilege must be used to hold door open for other allies. Lorde describes the inherent problems within society by saying, "racism, the belief in the inherent superiority of one race over all others and thereby the right to dominance. Sexism, the belief in the inherent superiority of one sex over the other and thereby the right to dominance. Ageism. Heterosexism. Elitism. Classism." Lorde finds herself among some of these "deviant" groups in society, which set the tone for the status quo and what "not to be" in society. Lorde argues that women feel pressure to conform to their "oneness" before recognizing the separation among them due to their "manyness", or aspects of their identity. She stresses that this behavior is exactly what "explains feminists' inability to forge the kind of alliances necessary to create a better world".
              </p>
              <p>&nbsp;</p>
              <p>
                In relation to non-intersectional feminism in the United States, Lorde famously said:
              </p>
              <p>&nbsp;</p>
              <p>
                Those of us who stand outside the circle of this society's definition of acceptable women; those of us who have been forged in the crucibles of difference -- those of us who are poor, who are lesbians, who are Black, who are older -- know that survival is not an academic skill. It is learning how to take our differences and make them strengths. For the master's tools will never dismantle the master's house. They may allow us temporarily to beat him at his own game, but they will never enable us to bring about genuine change. And this fact is only threatening to those women who still define the master's house as their only source of support.
              </p>
              <p>&nbsp;</p>
              <p>
                — Audre Lorde, The Master's Tools Will Never Dismantle the Master's House, Sister Outsider: Essays and Speeches (1984)
              </p>
            </div>
          </div>

          <div v-else-if="!isEditMode && isMinervaSkin" class="article-content-section minerva-article-content">
            <div class="minerva-first-section">
              <div class="minerva-intro">
                <p>
                  <strong>Audre Lorde</strong> (<a href="#">/ˈɔːdri ˈlɔːrd/</a> <em>AW-dree LORD</em>; born <strong>Audrey Geraldine Lorde</strong>; February 18, 1934 – November 17, 1992) was an American writer, professor, philosopher, intersectional <a href="#">feminist</a>, <a href="#">poet</a> and <a href="#">civil rights activist</a>. She was a self-described "Black, lesbian, feminist, socialist, mother, warrior, poet" who dedicated her life and talents to confronting different forms of injustice, as she believed there could be "no hierarchy of oppressions" among "those who share the goals of liberation and a workable future for our children".
                </p>
                <p>&nbsp;</p>
                <p>
                  As a poet, she is well known for technical mastery and emotional expression, as well as her poems that express anger and outrage at civil and social injustices she observed throughout her life. She was the recipient of national and international awards and the founding member of <em>Kitchen Table: Women of Color Press</em>. As a <a href="#">spoken word</a> artist, her delivery has been called powerful, melodic, and intense by the Poetry Foundation. Her poems and prose largely deal with issues related to civil rights, feminism, lesbianism, illness, disability, and the exploration of Black female identity.
                </p>
              </div>

              <aside class="infobox">
                <div class="infobox-title">Audre Lorde</div>
                
                <div class="infobox-image-section">
                  <div class="infobox-image">
                    <img :src="audreImage" alt="Audre Lorde in 1980" />
                  </div>
                  <div class="infobox-caption">Lorde in 1980</div>
                </div>

                <div class="infobox-row">
                  <div class="infobox-label">Born</div>
                  <div class="infobox-value">
                    Audrey Geraldine Lorde<br>
                    February 18, 1934[1]<br>
                    <a href="#">New York City</a>, U.S.
                  </div>
                </div>

                <div class="infobox-row infobox-row-faded">
                  <div class="infobox-label">Died</div>
                  <div class="infobox-value">
                    November 17, 1992 (aged 58)<br>
                    <a href="#">Saint Croix, Virgin Islands</a>, U.S.
                  </div>
                </div>

                <div class="infobox-row">
                  <div class="infobox-label">Education</div>
                  <div class="infobox-value infobox-value-link">
                    <a href="#">National Autonomous University of Mexico</a><br>
                    <a href="#">Hunter College (BA)</a><br>
                    <a href="#">Columbia University (MLS)</a>
                  </div>
                </div>

                <div class="infobox-row">
                  <div class="infobox-label">Genre</div>
                  <div class="infobox-value">
                    Poetry<br>
                    Nonfiction
                  </div>
                </div>

                <div class="infobox-row">
                  <div class="infobox-label">Notable works</div>
                  <div class="infobox-value infobox-value-link">
                    The First Cities<br>
                    <a href="#">Zami: A New Spelling of My Name</a><br>
                    <a href="#">The Cancer Journals</a>
                  </div>
                </div>
              </aside>
            </div>

            <div class="minerva-accordion">
              <div class="minerva-accordion-item">
                <div class="minerva-accordion-header">
                  <button class="minerva-accordion-toggle" @click="toggleMinervaSection('early-life')" :aria-expanded="isMinervaSectionOpen('early-life')">
                    <cdx-icon :icon="cdxIconExpand" size="small" :class="{'minerva-accordion-icon--open': isMinervaSectionOpen('early-life') }" />
                    <span>Early life</span>
                  </button>
                  <button v-if="isMinervaSectionOpen('early-life')" class="minerva-accordion-edit" aria-label="Edit section" @click.stop="openEditAtSection('early-life')">
                    <cdx-icon :icon="cdxIconEdit" size="small" />
                  </button>
                </div>
                <div v-if="isMinervaSectionOpen('early-life')" class="minerva-accordion-panel">
                  <div class="body-text">
                    <p>
                      Audre Lorde was born on February 18, 1934, in <a href="#">New York City</a> to Caribbean immigrants Frederick Byron Lorde and Linda Gertrude Belmar Lorde. Her father, Frederick Byron Lorde (Byron), was born on April 20, 1898, in <a href="#">Barbados</a>. Her mother, Linda Gertrude Belmar Lorde, was born in 1902 on the island <a href="#">Carriacou</a> in <a href="#">Grenada</a>. Lorde's mother was a light-skinned Black woman but sometimes passed as Spanish, for employment opportunities. Lorde's father was darker than the Belmar family liked, and they only allowed the couple to marry because of Byron's charm, ambition, and persistence. After their immigration, the new family settled in <a href="#">Harlem</a>, a diverse neighborhood in upper Manhattan, New York. Lorde was the youngest of three daughters. Lorde was nearsighted to the point of being legally blind. At the age of four she learned to read at the same time she learned to talk, with the help of Augusta Braxton Baker, then children's librarian at the 135th Street Branch of the New York Public Library. Her mother taught her to write at around the same time.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Born Audrey Geraldine Lorde, she chose to drop the "y" from her first name while still a child, explaining in <em><a href="#">Zami: A New Spelling of My Name</a></em> that she was more interested in the artistic symmetry of the "e"-endings in the two side-by-side names "Audre Lorde" than in spelling her name the way her parents had intended.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Lorde's relationship with her parents was difficult from a young age. She spent very little time with her father and mother, who were both busy maintaining their property management business in the tumultuous economy after <a href="#">the Great Depression</a>. When she did see them, they were often cold or emotionally distant. In particular, Lorde's relationship with her mother, who was deeply suspicious of people with darker skin than hers (which Lorde had) and the outside world in general, was characterized by "tough love" and strict adherence to family rules. Lorde's difficult relationship with her mother figured prominently in her later poems, such as <em>Coal</em>'s "Story Books on a Kitchen Table"
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      As a child, Lorde struggled with communication, and came to appreciate the power of poetry as a form of expression. She even described herself as thinking in poetry, stating that she would always "see things in terms of poetry". She explains that it was a way for her to understand and articulate her feelings. She went on to state that it was her way of "birthing myself into a world that I could bring into myself".
                    </p>
                  </div>
                </div>
              </div>

              <div class="minerva-accordion-item">
                <div class="minerva-accordion-header">
                  <button class="minerva-accordion-toggle" @click="toggleMinervaSection('career')" :aria-expanded="isMinervaSectionOpen('career')">
                    <cdx-icon :icon="cdxIconExpand" size="small" :class="{'minerva-accordion-icon--open': isMinervaSectionOpen('career') }" />
                    <span>Career</span>
                  </button>
                  <button v-if="isMinervaSectionOpen('career')" class="minerva-accordion-edit" aria-label="Edit section" @click.stop="openEditAtSection('career')">
                    <cdx-icon :icon="cdxIconEdit" size="small" />
                  </button>
                </div>
                <div v-if="isMinervaSectionOpen('career')" class="minerva-accordion-panel">
                  <div class="body-text">
                    <p>
                      In 1954, she spent a pivotal year as a student at the <a href="#">National Autonomous University of Mexico</a>, a period she described as a time of affirmation and renewal. During this time, she confirmed her identity on personal and artistic levels as both a lesbian and a poet. On her return to New York, Lorde attended <a href="#">Hunter College</a>, and graduated in the class of 1959. While there, she worked as a librarian, continued writing, and became an active participant in the <a href="#">gay culture</a> of <a href="#">Greenwich Village</a>. She furthered her education at the <a href="#">Columbia University School of Library Service</a>, earning a master's degree in <a href="#">library science</a> in 1961. During this period, she worked as a public librarian in nearby <a href="#">Mount Vernon, New York</a>.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      In 1968 Lorde was writer-in-residence at <a href="#">Tougaloo College</a> in Mississippi. Lorde's time at Tougaloo College, like her year at the <a href="#">National University of Mexico</a>, was a formative experience for her as an artist. She led workshops with her young, black undergraduate students, many of whom were eager to discuss the <a href="#">civil rights</a> issues of that time. Through these discussions with her students, she reaffirmed her desire not only to live out her "crazy and queer" identity, but also to devote attention to the formal aspects of her craft as a poet. Her book of poems, <em>Cables to Rage</em>, came out of her time and experiences at Tougaloo.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      From 1972 to 1987, Lorde resided on <a href="#">Staten Island</a>. During that time, in addition to writing and teaching she co-founded <a href="#">Kitchen Table: Women of Color Press</a>.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      In 1977, Lorde became an associate of the <a href="#">Women's Institute for Freedom of the Press</a> (WIFP). WIFP is an American nonprofit publishing organization. The organization works to increase communication between women and connect the public with forms of women-based media.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Lorde taught in the Education Department at <a href="#">Lehman College</a> from 1969 to 1970, then as a professor of English at <a href="#">John Jay College of Criminal Justice</a> (both part of the <a href="#">City University of New York</a>, CUNY) from 1970 to 1981. There, she fought for the creation of a <a href="#">black studies</a> department. In 1981, she went on to teach at her alma mater, <a href="#">Hunter College</a> (also CUNY), as the distinguished Thomas Hunter chair. As a queer Black woman, she was an outsider in a <a href="#">white male</a> dominated field and her experiences in this environment deeply influenced her work. New fields such as <a href="#">African American studies</a> and <a href="#">women's studies</a> advanced the topics that scholars were addressing and garnered attention to groups that had previously been rarely discussed. With this newfound <a href="#">academic</a> environment, Lorde was inspired to not only write poetry but also essays and articles about queer, feminist, and African American studies.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      In 1980, together with <a href="#">Barbara Smith</a> and <a href="#">Cherríe Moraga</a>, she co-founded <a href="#">Kitchen Table: Women of Color Press</a>, the first U.S. publisher for women of color.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      In 1981, Lorde was among the founders of the Women's Coalition of St. Croix, an organization dedicated to assisting women who have survived sexual abuse and <a href="#">intimate partner violence</a>. In the late 1980s, she also helped establish Sisterhood in Support of Sisters (SISA) in South Africa to benefit black women who were affected by <a href="#">apartheid</a> and other forms of injustice.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      In 1985, Audre Lorde was a part of a delegation of <a href="#">black women</a> writers who had been invited to <a href="#">Cuba</a>. The trip was sponsored by <em>The Black Scholar</em> and the Union of Cuban Writers. She embraced the shared sisterhood as black women writers. They visited Cuban poets <a href="#">Nancy Morejón</a> and <a href="#">Nicolas Guillén</a>. They discussed whether the Cuban revolution had truly changed racism and the status of lesbians and gays there.
                    </p>
                  </div>
                </div>
              </div>

              <div class="minerva-accordion-item">
                <div class="minerva-accordion-header">
                  <button class="minerva-accordion-toggle" @click="toggleMinervaSection('poetry')" :aria-expanded="isMinervaSectionOpen('poetry')">
                    <cdx-icon :icon="cdxIconExpand" size="small" :class="{'minerva-accordion-icon--open': isMinervaSectionOpen('poetry') }" />
                    <span>Poetry</span>
                  </button>
                  <button v-if="isMinervaSectionOpen('poetry')" class="minerva-accordion-edit" aria-label="Edit section" @click.stop="openEditAtSection('poetry')">
                    <cdx-icon :icon="cdxIconEdit" size="small" />
                  </button>
                </div>
                <div v-if="isMinervaSectionOpen('poetry')" class="minerva-accordion-panel">
                  <div class="body-text">
                    <p>
                      Lorde focused her discussion of difference not only on differences between groups of women but between conflicting differences within the individual. "I am defined as other in every group I'm part of," she declared. "Yet without community," Lorde wrote, "there is certainly no liberation, no future, only the most vulnerable and temporary armistice between me and my oppression". She described herself both as a part of a "continuum of women" and a "concert of voices" within herself.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Her conception of her many layers of selfhood is replicated in the multi-genres of her work. Critic Carmen Birkle wrote: "Her multicultural self is thus reflected in a multicultural text, in multi-genres, in which the individual cultures are no longer separate and autonomous entities but melt into a larger whole without losing their individual importance." Her refusal to be placed in a particular category, whether social or literary, was characteristic of her determination to come across as an individual rather than a stereotype. Lorde considered herself a "lesbian, mother, warrior, poet" and used poetry to get this message across.
                    </p>
                    <p>&nbsp;</p>
                    <p><strong>Early works</strong></p>
                    <p>&nbsp;</p>
                    <p>
                      Lorde's poetry was published very regularly during the 1960s - in Langston Hughes' 1962 New Negro Poets, USA; in several foreign anthologies; and in black literary magazines. During this time, she was also politically active in civil rights, anti-war, and feminist movements.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      In 1968, Lorde published The First Cities, her first volume of poems. It was edited by Diane di Prima, a former classmate and friend from Hunter College High School. The First Cities has been described as a "quiet, introspective book", and Dudley Randall, a poet and critic, asserted in his review of the book that Lorde "does not wave a black flag, but her Blackness is there, implicit, in the bone".
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Her second volume, Cables to Rage (1970), which was mainly written during her tenure as poet-in-residence at Tougaloo College in Mississippi, addressed themes of love, betrayal, childbirth, and the complexities of raising children. It is particularly noteworthy for the poem "Martha", in which Lorde openly confirms her homosexuality for the first time in her writing: "[W]e shall love each other here if ever at all".
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Nominated for the National Book Award for poetry in 1974, From a Land Where Other People Live (Broadside Press) shows Lorde's personal struggles with identity and anger at social injustice. The volume deals with themes of anger, loneliness, and injustice, as well as what it means to be a black woman, mother, friend, and lover.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      1974 saw the release of New York Head Shop and Museum, which gives a picture of Lorde's New York through the lenses of both the civil rights movement and her own restricted childhood: stricken with poverty and neglect and, in Lorde's opinion, in need of political action.
                    </p>
                    <p>&nbsp;</p>
                    <p><strong>Wider recognition</strong></p>
                    <p>&nbsp;</p>
                    <p>
                      Despite the success of these volumes, it was the release of Coal in 1976 that established Lorde as an influential voice in the Black Arts Movement, and the large publishing house behind it - Norton - helped introduce her to a wider audience. The volume includes poems from both The First Cities and Cables to Rage, and it unites many of the themes Lorde would become known for throughout her career: her rage at racial injustice, her celebration of her black identity, and her call for an intersectional consideration of women's experiences. Lorde followed Coal up with Between Our Selves (also in 1976) and Hanging Fire (1978).
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      In Lorde's volume The Black Unicorn (1978), she describes her identity within the mythos of African female deities of creation, fertility, and warrior strength. This reclamation of African female identity both builds and challenges existing Black Arts ideas about pan-Africanism. While writers like Amiri Baraka and Ishmael Reed utilized African cosmology in a way that "furnished a repertoire of bold male gods capable of forging and defending an aboriginal Black universe," in Lorde's writing "that warrior ethos is transferred to a female vanguard capable equally of force and fertility".
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Lorde's poetry became more open and personal as she grew older and became more confident in her sexuality. In Sister Outsider: Essays and Speeches, Lorde states, "Poetry is the way we help give name to the nameless so it can be thought... As they become known to and accepted by us, our feelings and the honest exploration of them become sanctuaries and spawning grounds for the most radical and daring ideas." Sister Outsider also elaborates Lorde's challenge to European-American traditions.
                    </p>
                  </div>
                </div>
              </div>

              <div class="minerva-accordion-item">
                <div class="minerva-accordion-header">
                  <button class="minerva-accordion-toggle" @click="toggleMinervaSection('prose')" :aria-expanded="isMinervaSectionOpen('prose')">
                    <cdx-icon :icon="cdxIconExpand" size="small" :class="{'minerva-accordion-icon--open': isMinervaSectionOpen('prose') }" />
                    <span>Prose</span>
                  </button>
                  <button v-if="isMinervaSectionOpen('prose')" class="minerva-accordion-edit" aria-label="Edit section" @click.stop="openEditAtSection('prose')">
                    <cdx-icon :icon="cdxIconEdit" size="small" />
                  </button>
                </div>
                <div v-if="isMinervaSectionOpen('prose')" class="minerva-accordion-panel">
                  <div class="body-text">
                    <p>
                      The Cancer Journals (1980) and A Burst of Light (1988) both use non-fiction prose, including essays and journal entries, to bear witness to, explore, and reflect on Lorde's diagnosis, treatment, recovery from breast cancer, and ultimately fatal recurrence with liver metastases. In both works, Lorde deals with Western notions of illness, disability, treatment, cancer and sexuality, and physical beauty and prosthesis, as well as themes of death, fear of mortality, survival, emotional healing, and inner power.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Lorde's deeply personal book Zami: A New Spelling of My Name (1982), subtitled a "biomythography", chronicles her childhood and adulthood. The narrative deals with the evolution of Lorde's sexuality and self-awareness.
                    </p>
                    <p>&nbsp;</p>
                    <p><strong>Sister Outsider</strong></p>
                    <p>&nbsp;</p>
                    <p>
                      In Sister Outsider: Essays and Speeches (1984), Lorde asserts the necessity of communicating the experience of marginalized groups to make their struggles visible in a repressive society. She emphasizes the need for different groups of people (particularly white women and African-American women) to find common ground in their experiences in life, but also to face difference directly, and use it as a source of strength rather than alienation. She repeatedly emphasizes the need for community in the struggle to build a better world. How to constructively channel the anger and rage incited by oppression is another prominent theme throughout her works, and in this collection in particular.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Her most famous essay, "The Master's Tools Will Never Dismantle the Master's House", is included in Sister Outsider. Lorde questions the scope and ability for change to be instigated when examining problems through a racist, patriarchal lens. She insists that women see differences between other women not as something to be tolerated, but something that is necessary to generate power and to actively "be" in the world. This will create a community that embraces differences, which will ultimately lead to liberation. Lorde elucidates, "Divide and conquer, in our world, must become define and empower." Also, people must educate themselves about the oppression of others because expecting a marginalized group to educate the oppressors is the continuation of racist, patriarchal thought. She explains that this is a major tool utilized by oppressors to keep the oppressed occupied with the master's concerns. She concludes that to bring about real change, we cannot work within the racist, patriarchal framework because change brought about in that will not remain.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Also in Sister Outsider is the essay, "The Transformation of Silence into Language and Action". Lorde discusses the importance of speaking, even when afraid, because otherwise silence immobilizes and chokes us. Many people fear to speak the truth because of the real risks of retaliation, but Lorde warns, "Your silence does not protect you." Lorde emphasizes that "the transformation of silence into language and action is a self-revelation, and that always seems fraught with danger." People are afraid of others' reactions for speaking, but mostly for demanding visibility, which is essential to live. Lorde adds, "We can sit in our corners mute forever while our sisters and ourselves are wasted, while our children are distorted and destroyed, while our earth is poisoned; we can sit in our safe corners mute as bottles, and we will still be no less afraid." "People are taught to respect their fear of speaking more than silence, but ultimately, the silence will choke us anyway, so we might as well speak the truth." Lorde writes that we can learn to speak even when we are afraid.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      In "Age, Race, Class, and Sex: Women Redefining Difference", Lorde emphasizes the importance of educating others. However, she stresses that in order to educate others, one must first be educated. Empowering people who are doing the work does not mean using privilege to overstep and overpower such groups; but rather, privilege must be used to hold door open for other allies. Lorde describes the inherent problems within society by saying, "racism, the belief in the inherent superiority of one race over all others and thereby the right to dominance. Sexism, the belief in the inherent superiority of one sex over the other and thereby the right to dominance. Ageism. Heterosexism. Elitism. Classism." Lorde finds herself among some of these "deviant" groups in society, which set the tone for the status quo and what "not to be" in society. Lorde argues that women feel pressure to conform to their "oneness" before recognizing the separation among them due to their "manyness", or aspects of their identity. She stresses that this behavior is exactly what "explains feminists' inability to forge the kind of alliances necessary to create a better world".
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      In relation to non-intersectional feminism in the United States, Lorde famously said:
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Those of us who stand outside the circle of this society's definition of acceptable women; those of us who have been forged in the crucibles of difference -- those of us who are poor, who are lesbians, who are Black, who are older -- know that survival is not an academic skill. It is learning how to take our differences and make them strengths. For the master's tools will never dismantle the master's house. They may allow us temporarily to beat him at his own game, but they will never enable us to bring about genuine change. And this fact is only threatening to those women who still define the master's house as their only source of support.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      — Audre Lorde, The Master's Tools Will Never Dismantle the Master's House, Sister Outsider: Essays and Speeches (1984)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="minerva-last-edited">
              <cdx-icon :icon="cdxIconClock" size="small" />
              <div class="minerva-last-edited-text">
                <div class="minerva-last-edited-title">Last edited 1 month ago</div>
                <div class="minerva-last-edited-subtitle">Unreviewed</div>
              </div>
              <cdx-icon :icon="cdxIconNext" size="small" class="minerva-last-edited-arrow" />
            </div>

            <div class="minerva-related">
              <div class="minerva-related-title">RELATED PAGES</div>
              <div class="minerva-related-list">
                <div class="minerva-related-card">
                  <cdx-icon :icon="cdxIconArticle" size="small" />
                  <div class="minerva-related-content">
                    <div class="minerva-related-name">Article title (max 2 lines)</div>
                    <div class="minerva-related-meta">Wikipedia article (more) 1 mo</div>
                  </div>
                </div>
                <div class="minerva-related-card">
                  <cdx-icon :icon="cdxIconArticle" size="small" />
                  <div class="minerva-related-content">
                    <div class="minerva-related-name">Article title (max 2 lines)</div>
                    <div class="minerva-related-meta">Wikipedia article (more) 1 mo</div>
                  </div>
                </div>
                <div class="minerva-related-card">
                  <cdx-icon :icon="cdxIconArticle" size="small" />
                  <div class="minerva-related-content">
                    <div class="minerva-related-name">Article title (max 2 lines)</div>
                    <div class="minerva-related-meta">Wikipedia article (more) 1 mo</div>
                  </div>
                </div>
              </div>
            </div>

            <footer class="minerva-footer">
              <div class="minerva-footer-brand">Wikipedia</div>
              <div class="minerva-footer-meta">
                Content is available under <a href="#">CC BY-SA 4.0</a> unless otherwise noted.
              </div>
            </footer>
          </div>

          <!-- Edit Mode Content -->
          <div v-else class="edit-mode-content">
            <!-- Editor Toolbar -->
            <div v-if="isMinervaSkin" class="editor-toolbar editor-toolbar--minerva" :class="{ 'editor-toolbar--scrolled': isEditToolbarScrolled }">
              <button class="toolbar-btn toolbar-btn-icon-only" aria-label="Close" @click="toggleEditMode">
                <cdx-icon :icon="cdxIconClose" size="medium" />
              </button>
              <button
                class="toolbar-btn toolbar-btn-icon-only"
                :class="{ 'toolbar-btn-disabled': !hasUnsavedChanges }"
                :disabled="!hasUnsavedChanges"
                aria-label="Undo"
                @click="undoEdits"
              >
                <cdx-icon :icon="cdxIconUndo" size="medium" />
              </button>
              <button class="toolbar-btn toolbar-btn-icon-only" aria-label="Text styles">
                <cdx-icon :icon="cdxIconTextStyle" size="medium" />
                <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
              </button>
              <button class="toolbar-btn toolbar-btn-icon-only" aria-label="Cite">
                <cdx-icon :icon="cdxIconQuotes" size="medium" />
              </button>
              <button class="toolbar-btn toolbar-btn-icon-only" aria-label="Link">
                <cdx-icon :icon="cdxIconLink" size="medium" />
              </button>
              <button class="toolbar-btn toolbar-btn-icon-only" aria-label="Edit options">
                <cdx-icon :icon="cdxIconEdit" size="medium" />
                <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
              </button>
              <button
                class="toolbar-btn toolbar-btn-icon-only toolbar-btn-primary"
                :class="{ 'toolbar-btn-primary--disabled': !hasUnsavedChanges }"
                :disabled="!hasUnsavedChanges"
                aria-label="Publish"
              >
                <cdx-icon :icon="cdxIconNext" size="medium" />
              </button>
            </div>
            <div v-else class="editor-toolbar" :class="{ 'editor-toolbar--scrolled': isEditToolbarScrolled }">
              <div class="editor-toolbar-left">
                <button
                  class="toolbar-btn toolbar-btn-icon-only"
                  :class="{ 'toolbar-btn-disabled': !hasUnsavedChanges }"
                  :disabled="!hasUnsavedChanges"
                  @click="undoEdits"
                >
                  <cdx-icon :icon="cdxIconUndo" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only toolbar-btn-disabled" disabled>
                  <cdx-icon :icon="cdxIconRedo" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <span class="toolbar-btn-text">Paragraph</span>
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <cdx-icon :icon="cdxIconTextStyle" size="medium" />
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconLink" size="medium" />
                </button>
                <button class="toolbar-btn">
                  <cdx-icon :icon="cdxIconQuotes" size="medium" />
                  <span class="toolbar-btn-text">Cite</span>
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <cdx-icon :icon="cdxIconListBullet" size="medium" />
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <span class="toolbar-btn-text">Insert</span>
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconSpecialCharacter" size="medium" />
                </button>
              </div>
              <div class="editor-toolbar-right">
                <cdx-toggle-button 
                  v-if="showToolbarToggle"
                  v-model="showSuggestions"
                  quiet
                  aria-label="Toggle suggestions"
                  class="suggestions-toggle-btn"
                  :class="{ 'suggestions-toggle-btn--active': showSuggestions }"
                >
                  <span class="lightbulb-icon-wrapper">
                    <span v-if="showSuggestions" class="bulb-rays">
                      <span class="ray ray-1"></span>
                      <span class="ray ray-2"></span>
                      <span class="ray ray-3"></span>
                      <span class="ray ray-4"></span>
                      <span class="ray ray-5"></span>
                    </span>
                    <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    <span
                      v-if="showToggleBadge"
                      class="suggestions-badge"
                      :class="{ 'suggestions-badge--empty': availableSuggestionCount === 0 }"
                    >
                      {{ availableSuggestionCount }}
                    </span>
                  </span>
                </cdx-toggle-button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconHelp" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconAlert" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconMenu" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <cdx-icon :icon="cdxIconEdit" size="medium" />
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn-primary" :class="{ 'toolbar-btn-primary--disabled': !hasUnsavedChanges }" :disabled="!hasUnsavedChanges">
                  Publish changes...
                </button>
              </div>
            </div>

            <!-- Loading Overlay (only covers content below toolbar) -->
            <div v-if="isLoading" class="loading-overlay"></div>

            <!-- ProgressBar (centered, 32px below toolbar) -->
            <div v-if="isLoading" class="loading-progress">
              <cdx-progress-bar aria-label="Loading edit mode" />
            </div>

            <!-- Article Content Edit -->
            <div class="article-content-edit">
              <!-- Tagline + Short description -->
              <transition name="banner-reveal" appear>
                <div
                  v-if="shouldShowBanner && isBannerDelayReady && !isBannerDismissed"
                  class="suggestions-banner"
                  :class="{
                    'suggestions-banner--empty': availableSuggestionCount === 0,
                    'suggestions-banner--minerva-bottom': false,
                    'suggestions-banner--minerva-top': isMinervaSkin,
                    'suggestions-banner--minerva': isMinervaSkin,
                    'suggestions-banner--hidden': !showSuggestionToggle && !showSuggestions,
                    'suggestions-banner--clickable': showSuggestions,
                    'suggestions-banner--closing': isBannerClosing,
                    'suggestions-banner--opening': isBannerOpening,
                    'suggestions-banner--scrolled': isEditToolbarScrolled
                  }"
                  :role="showSuggestions ? 'button' : undefined"
                  :tabindex="showSuggestions ? 0 : undefined"
                  @click="showSuggestions ? handleBannerClick() : null"
                  @keydown="showSuggestions ? handleBannerKeydown($event) : null"
                >
                  <div class="suggestions-banner-center">
                    <div
                      v-if="showSuggestionToggle || showSuggestions"
                      class="suggestions-banner-text"
                    >
                      <strong>{{ availableSuggestionCount }} {{ bannerCountLabel }}</strong> {{ bannerTextRemainder }}
                    </div>
                    <cdx-button
                    v-if="!showSuggestionToggle && !isMinervaSkin"
                    class="suggestions-banner-action"
                    action="default"
                    :weight="showSuggestions ? 'quiet' : 'normal'"
                    size="small"
                    @click.stop="handleHideSuggestionsBanner"
                  >
                    {{ bannerButtonLabel }}
                  </cdx-button>
                  <cdx-button
                    v-if="isMinervaSkin && !showSuggestionToggle"
                    class="suggestions-banner-action"
                    action="default"
                    :weight="showSuggestions ? 'quiet' : 'normal'"
                    size="small"
                    @click.stop="handleBannerToggleClick"
                  >
                    {{ bannerButtonLabel }}
                  </cdx-button>
                  </div>
                  <div class="suggestions-banner-actions">
                  </div>
                </div>
              </transition>
              <div
                v-if="isMinervaSkin && showSuggestions && showMinervaSuccessMessage"
                ref="minervaSuccessRef"
                class="success-message success-message--minerva"
              >
                <div class="success-icon">
                  <cdx-icon :icon="cdxIconSuccess" size="medium" />
                </div>
                <div class="success-content">
                  <p class="success-text">Thank you for helping to make this section easier for people to read.</p>
                </div>
              </div>
              <div class="edit-header">
                <p class="tagline-edit">From Wikipedia, the free encyclopedia</p>
                
                <div class="short-description-section">
                  <button class="short-description-btn">
                    <cdx-icon :icon="cdxIconPuzzle" size="medium" class="short-description-icon" />
                    <span class="short-description-text">Short description</span>
                  </button>
                </div>
              </div>
              <div class="article-main-edit">
                <!-- First Section with Infobox -->
                <div class="article-first-section" ref="articleFirstSectionRef">
                  <div class="article-text-block">
                    <div contenteditable="true" @input="markArticleEdited" class="article-text-editable">
                      <p>
                        <strong>Audre Lorde</strong> (<a href="#">/ˈɔːdri ˈlɔːrd/</a>; born <strong>Audrey Geraldine Lorde</strong>; February 18, 1934 – November 17, 1992) was an American writer, <a href="#">feminist</a>, <a href="#">womanist</a>, <a href="#">librarian</a>, and <a href="#">civil rights</a> incredible amazing activist. She was a self-described "black, lesbian, mother, warrior, poet," who "dedicated both her life and her creative talent to confronting and addressing injustices of <a href="#">racism</a>, <a href="#">sexism</a>, <a href="#">classism</a>, and <a href="#">homophobia</a>.
                      </p>
                      <p>&nbsp;</p>
                      <p>
                        As a poet, she is best known for technical mastery and emotional expression, as well as her poems that express anger and outrage at civil and social injustices she observed throughout her life.
                      </p>
                      <p>&nbsp;</p>
                      <p>
                        As a <a href="#">spoken word</a> artist, her delivery has been called powerful, melodic, and intense by the Poetry Foundation. Her poems and prose largely deal with issues related to civil rights, feminism, lesbianism, illness and disability, and the exploration of black female identity.
                      </p>
                    </div>
                  </div>
                  
                  <aside class="infobox">
                    <div class="infobox-title">Audre Lorde</div>
                    
                    <div class="infobox-image-section">
                      <div class="infobox-image">
                        <img :src="audreImage" alt="Audre Lorde in 1980" />
                      </div>
                      <div class="infobox-caption">Lorde in 1980</div>
                    </div>

                    <div class="infobox-row">
                      <div class="infobox-label">Born</div>
                      <div class="infobox-value">
                        Audrey Geraldine Lorde<br>
                        February 18, 1934[1]<br>
                        <a href="#">New York City</a>, U.S.
                      </div>
                    </div>

                    <div class="infobox-row infobox-row-faded">
                      <div class="infobox-label">Died</div>
                      <div class="infobox-value">
                        November 17, 1992 (aged 58)<br>
                        <a href="#">Saint Croix, Virgin Islands</a>, U.S.
                      </div>
                    </div>

                    <div class="infobox-row">
                      <div class="infobox-label">Education</div>
                      <div class="infobox-value infobox-value-link">
                        <a href="#">National Autonomous University of Mexico</a><br>
                        <a href="#">Hunter College (BA)</a><br>
                        <a href="#">Columbia University (MLS)</a>
                      </div>
                    </div>

                    <div class="infobox-row">
                      <div class="infobox-label">Genre</div>
                      <div class="infobox-value">
                        Poetry<br>
                        Nonfiction
                      </div>
                    </div>

                    <div class="infobox-row">
                      <div class="infobox-label">Notable works</div>
                      <div class="infobox-value infobox-value-link">
                        The First Cities<br>
                        <a href="#">Zami: A New Spelling of My Name</a><br>
                        <a href="#">The Cancer Journals</a>
                      </div>
                    </div>
                  </aside>
                </div>

                <!-- Early Life Section -->
                <div class="section-heading-edit" ref="editSectionEarlyLife">
                  <h2 class="heading-text-edit">Early life</h2>
                  <div class="heading-divider"></div>
                </div>
                
                <div contenteditable="true" @input="markArticleEdited" class="article-text-editable">
                  <p>
                    Lorde was born in New York City, the best city in the world. Her father, Frederick Byron Lorde, (known as Byron) hailed from Barbados and her mother, Linda Gertrude Belmar Lorde, was Grenadian and had been born in the amazing island of <a href="#">Carriacou</a>.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    Lorde's mother was of mixed ancestry but could "<a href="#">pass</a>" for '<a href="#">Spanish</a>',which was a source of pride for her family. Lorde's father was darker than the Belmar family liked, and they only allowed the couple to marry because of Byron Lorde's charm, ambition, and persistence.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    The family settled in <a href="#">Harlem</a>. Lord was <a href="#">nearsighted</a> to the point of <a href="#">being legally</a> blind and the youngest of three daughters (her two older sisters were named Phyllis and Helen), Lorde grew up hearing her mother's stories about the <a href="#">West Indies</a>. At the age of four, she learned to talk while she learned to read, and her mother taught her to write at around the same time. She wrote her first poem when she was in eighth grade.
                  </p>
                </div>

                <!-- Career Section -->
                <div class="section-heading-edit" ref="editSectionCareer">
                  <h2 class="heading-text-edit">Career</h2>
                  <div class="heading-divider"></div>
                </div>
                
                <div contenteditable="true" @input="markArticleEdited" class="article-text-editable">
                  <p>
                    In 1954, she spent a pivotal year as a student at the <a href="#">National Autonomous University of Mexico</a>, a period she described as a time of affirmation and renewal. During this time, she confirmed her identity on personal and artistic levels as both a lesbian and a poet. On her return to New York, Lorde attended <a href="#">Hunter College</a>, and graduated in the class of 1959. While there, she worked as a librarian, continued writing, and became an active participant in the <a href="#">gay culture</a> of <a href="#">Greenwich Village</a>. She furthered her education at the <a href="#">Columbia University School of Library Service</a>, earning a master's degree in <a href="#">library science</a> in 1961. During this period, she worked as a public librarian in nearby <a href="#">Mount Vernon, New York</a>.
                  </p>
                  <p>&nbsp;</p>
                  <!-- Highlighted Text with interactive states -->
                  <p 
                    v-if="showSuggestions && !showSuccessMessage1 && citationNumber1 === null && !isSuggestionDeclined1"
                    ref="highlightedTextRef"
                    :class="{ 
                      'highlighted-text-wrapper': showSuggestions,
                      'highlighted-text-wrapper--hover': isHovered && showSuggestions && !isCardExpanded,
                      'highlighted-text-wrapper--selected': isCardExpanded && showSuggestions,
                      'minerva-suggestion-target': isMinervaSkin
                    }" 
                    class="suggestion-target"
                    @mouseenter="isTextHovered = true"
                    @mouseleave="isTextHovered = false"
                    @click="isMinervaSkin ? openMinervaSuggestion(1) : (isCardExpanded = true)"
                  >
                    <span class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      In 1968 Lorde was writer-in-residence at <a href="#">Tougaloo College</a> in Mississippi. Lorde's time at Tougaloo College, like her year at the <a href="#">National University of Mexico</a>, was a formative experience for her as an artist. She led workshops with her young, black undergraduate students, many of whom were eager to discuss the <a href="#">civil rights</a> issues of that time. Through these discussions with her students, she reaffirmed her desire not only to live out her "crazy and queer" identity, but also to devote attention to the formal aspects of her craft as a poet. Her book of poems, <em>Cables to Rage</em>, came out of her time and experiences at Tougaloo.<sup v-if="showCitationPopup1 || citationNumber1" class="citation-marker" ref="citationMarker1">[{{ citationNumber1 || '...' }}]</sup>
                    </span>
                    <span v-if="isMinervaSkin" class="minerva-highlight-rail"></span>
                    <button
                      v-if="isMinervaSkin"
                      type="button"
                      class="minerva-suggestion-trigger"
                      aria-label="Show suggestion"
                      @click.stop="openMinervaSuggestion(1)"
                    >
                      <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    </button>
                  </p>

                  <!-- Citation Popup 1 -->
                  <div v-if="showCitationPopup1" class="citation-popup">
                    <!-- Pointer arrow -->
                    <div class="citation-popup-pointer"></div>
                    
                    <div class="citation-popup-header">
                      <button class="citation-popup-close" @click="showCitationPopup1 = false" aria-label="Close">
                        <cdx-icon :icon="cdxIconClose" size="medium" />
                      </button>
                      <h3 class="citation-popup-title">Add citation</h3>
                    </div>
                    <div class="citation-popup-tabs">
                      <button class="citation-tab citation-tab--active">Automatic</button>
                      <button class="citation-tab">Manual</button>
                      <button class="citation-tab">Re-use</button>
                    </div>
                    <div class="citation-popup-content">
                      <p class="citation-popup-description">This is a text component which can be replaced with any component.</p>
                      <div class="citation-input-group">
                        <input 
                          v-model="citationUrl1" 
                          type="text" 
                          class="citation-input" 
                          placeholder="http://www.example.com"
                        />
                        <button 
                          class="citation-create-btn" 
                          :disabled="!isValidUrl1"
                          @click="createCitation1"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <p v-else>
                    In 1968 Lorde was writer-in-residence at <a href="#">Tougaloo College</a> in Mississippi. Lorde's time at Tougaloo College, like her year at the <a href="#">National University of Mexico</a>, was a formative experience for her as an artist. She led workshops with her young, black undergraduate students, many of whom were eager to discuss the <a href="#">civil rights</a> issues of that time. Through these discussions with her students, she reaffirmed her desire not only to live out her "crazy and queer" identity, but also to devote attention to the formal aspects of her craft as a poet. Her book of poems, <em>Cables to Rage</em>, came out of her time and experiences at Tougaloo.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    From 1972 to 1987, Lorde resided on <a href="#">Staten Island</a>. During that time, in addition to writing and teaching she co-founded <a href="#">Kitchen Table: Women of Color Press</a>.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    In 1977, Lorde became an associate of the <a href="#">Women's Institute for Freedom of the Press</a> (WIFP). WIFP is an American nonprofit publishing organization. The organization works to increase communication between women and connect the public with forms of women-based media.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    Lorde taught in the Education Department at <a href="#">Lehman College</a> from 1969 to 1970, then as a professor of English at <a href="#">John Jay College of Criminal Justice</a> (both part of the <a href="#">City University of New York</a>, CUNY) from 1970 to 1981. There, she fought for the creation of a <a href="#">black studies</a> department. In 1981, she went on to teach at her alma mater, <a href="#">Hunter College</a> (also CUNY), as the distinguished Thomas Hunter chair. As a queer Black woman, she was an outsider in a <a href="#">white male</a> dominated field and her experiences in this environment deeply influenced her work. New fields such as <a href="#">African American studies</a> and <a href="#">women's studies</a> advanced the topics that scholars were addressing and garnered attention to groups that had previously been rarely discussed. With this newfound <a href="#">academic</a> environment, Lorde was inspired to not only write poetry but also essays and articles about queer, feminist, and African American studies.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    In 1980, together with <a href="#">Barbara Smith</a> and <a href="#">Cherríe Moraga</a>, she co-founded <a href="#">Kitchen Table: Women of Color Press</a>, the first U.S. publisher for women of color.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    In 1981, Lorde was among the founders of the Women's Coalition of St. Croix, an organization dedicated to assisting women who have survived sexual abuse and <a href="#">intimate partner violence</a>. In the late 1980s, she also helped establish Sisterhood in Support of Sisters (SISA) in South Africa to benefit black women who were affected by <a href="#">apartheid</a> and other forms of injustice.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    In 1985, Audre Lorde was a part of a delegation of <a href="#">black women</a> writers who had been invited to <a href="#">Cuba</a>. The trip was sponsored by <em>The Black Scholar</em> and the Union of Cuban Writers. She embraced the shared sisterhood as black women writers. They visited Cuban poets <a href="#">Nancy Morejón</a> and <a href="#">Nicolas Guillén</a>. They discussed whether the Cuban revolution had truly changed racism and the status of lesbians and gays there.
                  </p>
                </div>

                <!-- Poetry Section -->
                <div class="section-heading-edit" ref="editSectionPoetry">
                  <h2 class="heading-text-edit">Poetry</h2>
                  <div class="heading-divider"></div>
                </div>

                <div contenteditable="true" @input="markArticleEdited" class="article-text-editable">
                  <p>
                    Lorde focused her discussion of difference not only on differences between groups of women but between conflicting differences within the individual. "I am defined as other in every group I'm part of," she declared. "Yet without community," Lorde wrote, "there is certainly no liberation, no future, only the most vulnerable and temporary armistice between me and my oppression". She described herself both as a part of a "continuum of women" and a "concert of voices" within herself.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    Her conception of her many layers of selfhood is replicated in the multi-genres of her work. Critic Carmen Birkle wrote: "Her multicultural self is thus reflected in a multicultural text, in multi-genres, in which the individual cultures are no longer separate and autonomous entities but melt into a larger whole without losing their individual importance." Her refusal to be placed in a particular category, whether social or literary, was characteristic of her determination to come across as an individual rather than a stereotype. Lorde considered herself a "lesbian, mother, warrior, poet" and used poetry to get this message across.
                  </p>
                  <p>&nbsp;</p>
                  <p><strong class="subsection-title">Early works</strong></p>
                  <p>&nbsp;</p>
                  <p>
                    Lorde's poetry was published very regularly during the 1960s - in Langston Hughes' 1962 New Negro Poets, USA; in several foreign anthologies; and in black literary magazines. During this time, she was also politically active in civil rights, anti-war, and feminist movements.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    In 1968, Lorde published The First Cities, her first volume of poems. It was edited by Diane di Prima, a former classmate and friend from Hunter College High School. The First Cities has been described as a "quiet, introspective book", and Dudley Randall, a poet and critic, asserted in his review of the book that Lorde "does not wave a black flag, but her Blackness is there, implicit, in the bone".
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    Her second volume, Cables to Rage (1970), which was mainly written during her tenure as poet-in-residence at Tougaloo College in Mississippi, addressed themes of love, betrayal, childbirth, and the complexities of raising children. It is particularly noteworthy for the poem "Martha", in which Lorde openly confirms her homosexuality for the first time in her writing: "[W]e shall love each other here if ever at all".
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    Nominated for the National Book Award for poetry in 1974, From a Land Where Other People Live (Broadside Press) shows Lorde's personal struggles with identity and anger at social injustice. The volume deals with themes of anger, loneliness, and injustice, as well as what it means to be a black woman, mother, friend, and lover.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    1974 saw the release of New York Head Shop and Museum, which gives a picture of Lorde's New York through the lenses of both the civil rights movement and her own restricted childhood: stricken with poverty and neglect and, in Lorde's opinion, in need of political action.
                  </p>
                  <p>&nbsp;</p>
                  <p><strong class="subsection-title">Wider recognition</strong></p>
                  <p>&nbsp;</p>
                  <p>
                    Despite the success of these volumes, it was the release of Coal in 1976 that established Lorde as an influential voice in the Black Arts Movement, and the large publishing house behind it - Norton - helped introduce her to a wider audience. The volume includes poems from both The First Cities and Cables to Rage, and it unites many of the themes Lorde would become known for throughout her career: her rage at racial injustice, her celebration of her black identity, and her call for an intersectional consideration of women's experiences. Lorde followed Coal up with Between Our Selves (also in 1976) and Hanging Fire (1978).
                  </p>
                  <p>&nbsp;</p>
                  <p
                    v-if="showSuggestions && !showSuccessMessage2 && citationNumber2 === null && !isSuggestionDeclined2"
                    ref="highlightedTextRef2"
                    :class="{ 
                      'highlighted-text-wrapper': showSuggestions,
                      'highlighted-text-wrapper--hover': isHovered2 && showSuggestions && !isCardExpanded2,
                      'highlighted-text-wrapper--selected': isCardExpanded2 && showSuggestions,
                      'minerva-suggestion-target': isMinervaSkin
                    }"
                    class="suggestion-target"
                    @mouseenter="isTextHovered2 = true"
                    @mouseleave="isTextHovered2 = false"
                    @click="isMinervaSkin ? openMinervaSuggestion(2) : (isCardExpanded2 = true)"
                  >
                    <span class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      In Lorde's volume The Black Unicorn (1978), she describes her identity within the mythos of African female deities of creation, fertility, and warrior strength. This reclamation of African female identity both builds and challenges existing Black Arts ideas about pan-Africanism. While writers like Amiri Baraka and Ishmael Reed utilized African cosmology in a way that "furnished a repertoire of bold male gods capable of forging and defending an aboriginal Black universe," in Lorde's writing "that warrior ethos is transferred to a female vanguard capable equally of force and fertility".<sup v-if="showCitationPopup2 || citationNumber2" class="citation-marker">[{{ citationNumber2 || '...' }}]</sup>
                    </span>
                    <span v-if="isMinervaSkin" class="minerva-highlight-rail"></span>
                    <button
                      v-if="isMinervaSkin"
                      type="button"
                      class="minerva-suggestion-trigger"
                      aria-label="Show suggestion"
                      @click.stop="openMinervaSuggestion(2)"
                    >
                      <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    </button>
                  </p>
                  <p v-else>
                    In Lorde's volume The Black Unicorn (1978), she describes her identity within the mythos of African female deities of creation, fertility, and warrior strength. This reclamation of African female identity both builds and challenges existing Black Arts ideas about pan-Africanism. While writers like Amiri Baraka and Ishmael Reed utilized African cosmology in a way that "furnished a repertoire of bold male gods capable of forging and defending an aboriginal Black universe," in Lorde's writing "that warrior ethos is transferred to a female vanguard capable equally of force and fertility".
                  </p>
                  <!-- Citation Popup 2 -->
                  <div v-if="showCitationPopup2" class="citation-popup">
                    <!-- Pointer arrow -->
                    <div class="citation-popup-pointer"></div>
                    
                    <div class="citation-popup-header">
                      <button class="citation-popup-close" @click="showCitationPopup2 = false" aria-label="Close">
                        <cdx-icon :icon="cdxIconClose" size="medium" />
                      </button>
                      <h3 class="citation-popup-title">Add citation</h3>
                    </div>
                    <div class="citation-popup-tabs">
                      <button class="citation-tab citation-tab--active">Automatic</button>
                      <button class="citation-tab">Manual</button>
                      <button class="citation-tab">Re-use</button>
                    </div>
                    <div class="citation-popup-content">
                      <p class="citation-popup-description">This is a text component which can be replaced with any component.</p>
                      <div class="citation-input-group">
                        <input 
                          v-model="citationUrl2" 
                          type="text" 
                          class="citation-input" 
                          placeholder="http://www.example.com"
                        />
                        <button 
                          class="citation-create-btn" 
                          :disabled="!isValidUrl2"
                          @click="createCitation2"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                  <p>&nbsp;</p>
                  <p>
                    Lorde's poetry became more open and personal as she grew older and became more confident in her sexuality. In Sister Outsider: Essays and Speeches, Lorde states, "Poetry is the way we help give name to the nameless so it can be thought... As they become known to and accepted by us, our feelings and the honest exploration of them become sanctuaries and spawning grounds for the most radical and daring ideas." Sister Outsider also elaborates Lorde's challenge to European-American traditions.
                  </p>
                </div>

                <!-- Prose Section -->
                <div class="section-heading-edit" ref="editSectionProse">
                  <h2 class="heading-text-edit">Prose</h2>
                  <div class="heading-divider"></div>
                </div>

                <div contenteditable="true" @input="markArticleEdited" class="article-text-editable">
                  <p>
                    The Cancer Journals (1980) and A Burst of Light (1988) both use non-fiction prose, including essays and journal entries, to bear witness to, explore, and reflect on Lorde's diagnosis, treatment, recovery from breast cancer, and ultimately fatal recurrence with liver metastases. In both works, Lorde deals with Western notions of illness, disability, treatment, cancer and sexuality, and physical beauty and prosthesis, as well as themes of death, fear of mortality, survival, emotional healing, and inner power.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    Lorde's deeply personal book Zami: A New Spelling of My Name (1982), subtitled a "biomythography", chronicles her childhood and adulthood. The narrative deals with the evolution of Lorde's sexuality and self-awareness.
                  </p>
                  <p>&nbsp;</p>
                  <p><strong class="subsection-title">Sister Outsider</strong></p>
                  <p>&nbsp;</p>
                  <p>
                    In Sister Outsider: Essays and Speeches (1984), Lorde asserts the necessity of communicating the experience of marginalized groups to make their struggles visible in a repressive society. She emphasizes the need for different groups of people (particularly white women and African-American women) to find common ground in their experiences in life, but also to face difference directly, and use it as a source of strength rather than alienation. She repeatedly emphasizes the need for community in the struggle to build a better world. How to constructively channel the anger and rage incited by oppression is another prominent theme throughout her works, and in this collection in particular.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    Her most famous essay, "The Master's Tools Will Never Dismantle the Master's House", is included in Sister Outsider. Lorde questions the scope and ability for change to be instigated when examining problems through a racist, patriarchal lens. She insists that women see differences between other women not as something to be tolerated, but something that is necessary to generate power and to actively "be" in the world. This will create a community that embraces differences, which will ultimately lead to liberation. Lorde elucidates, "Divide and conquer, in our world, must become define and empower." Also, people must educate themselves about the oppression of others because expecting a marginalized group to educate the oppressors is the continuation of racist, patriarchal thought. She explains that this is a major tool utilized by oppressors to keep the oppressed occupied with the master's concerns. She concludes that to bring about real change, we cannot work within the racist, patriarchal framework because change brought about in that will not remain.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    Also in Sister Outsider is the essay, "The Transformation of Silence into Language and Action". Lorde discusses the importance of speaking, even when afraid, because otherwise silence immobilizes and chokes us. Many people fear to speak the truth because of the real risks of retaliation, but Lorde warns, "Your silence does not protect you." Lorde emphasizes that "the transformation of silence into language and action is a self-revelation, and that always seems fraught with danger." People are afraid of others' reactions for speaking, but mostly for demanding visibility, which is essential to live. Lorde adds, "We can sit in our corners mute forever while our sisters and ourselves are wasted, while our children are distorted and destroyed, while our earth is poisoned; we can sit in our safe corners mute as bottles, and we will still be no less afraid." "People are taught to respect their fear of speaking more than silence, but ultimately, the silence will choke us anyway, so we might as well speak the truth." Lorde writes that we can learn to speak even when we are afraid.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    In "Age, Race, Class, and Sex: Women Redefining Difference", Lorde emphasizes the importance of educating others. However, she stresses that in order to educate others, one must first be educated. Empowering people who are doing the work does not mean using privilege to overstep and overpower such groups; but rather, privilege must be used to hold door open for other allies. Lorde describes the inherent problems within society by saying, "racism, the belief in the inherent superiority of one race over all others and thereby the right to dominance. Sexism, the belief in the inherent superiority of one sex over the other and thereby the right to dominance. Ageism. Heterosexism. Elitism. Classism." Lorde finds herself among some of these "deviant" groups in society, which set the tone for the status quo and what "not to be" in society. Lorde argues that women feel pressure to conform to their "oneness" before recognizing the separation among them due to their "manyness", or aspects of their identity. She stresses that this behavior is exactly what "explains feminists' inability to forge the kind of alliances necessary to create a better world".
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    In relation to non-intersectional feminism in the United States, Lorde famously said:
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    Those of us who stand outside the circle of this society's definition of acceptable women; those of us who have been forged in the crucibles of difference -- those of us who are poor, who are lesbians, who are Black, who are older -- know that survival is not an academic skill. It is learning how to take our differences and make them strengths. For the master's tools will never dismantle the master's house. They may allow us temporarily to beat him at his own game, but they will never enable us to bring about genuine change. And this fact is only threatening to those women who still define the master's house as their only source of support.
                  </p>
                  <p>&nbsp;</p>
                  <p
                    v-if="showSuggestions && !showSuccessMessage3 && citationNumber3 === null && !isSuggestionDeclined3"
                    ref="highlightedTextRef3"
                    :class="{ 
                      'highlighted-text-wrapper': showSuggestions,
                      'highlighted-text-wrapper--hover': isHovered3 && showSuggestions && !isCardExpanded3,
                      'highlighted-text-wrapper--selected': isCardExpanded3 && showSuggestions,
                      'minerva-suggestion-target': isMinervaSkin
                    }"
                    class="suggestion-target"
                    @mouseenter="isTextHovered3 = true"
                    @mouseleave="isTextHovered3 = false"
                    @click="isMinervaSkin ? openMinervaSuggestion(3) : (isCardExpanded3 = true)"
                  >
                    <span class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      — Audre Lorde, The Master's Tools Will Never Dismantle the Master's House, Sister Outsider: Essays and Speeches (1984)<sup v-if="showCitationPopup3 || citationNumber3" class="citation-marker">[{{ citationNumber3 || '...' }}]</sup>
                    </span>
                    <span v-if="isMinervaSkin" class="minerva-highlight-rail"></span>
                    <button
                      v-if="isMinervaSkin"
                      type="button"
                      class="minerva-suggestion-trigger"
                      aria-label="Show suggestion"
                      @click.stop="openMinervaSuggestion(3)"
                    >
                      <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    </button>
                  </p>
                  <p v-else>
                    — Audre Lorde, The Master's Tools Will Never Dismantle the Master's House, Sister Outsider: Essays and Speeches (1984)
                  </p>
                  <!-- Citation Popup 3 -->
                  <div v-if="showCitationPopup3" class="citation-popup">
                    <!-- Pointer arrow -->
                    <div class="citation-popup-pointer"></div>
                    
                    <div class="citation-popup-header">
                      <button class="citation-popup-close" @click="showCitationPopup3 = false" aria-label="Close">
                        <cdx-icon :icon="cdxIconClose" size="medium" />
                      </button>
                      <h3 class="citation-popup-title">Add citation</h3>
                    </div>
                    <div class="citation-popup-tabs">
                      <button class="citation-tab citation-tab--active">Automatic</button>
                      <button class="citation-tab">Manual</button>
                      <button class="citation-tab">Re-use</button>
                    </div>
                    <div class="citation-popup-content">
                      <p class="citation-popup-description">This is a text component which can be replaced with any component.</p>
                      <div class="citation-input-group">
                        <input 
                          v-model="citationUrl3" 
                          type="text" 
                          class="citation-input" 
                          placeholder="http://www.example.com"
                        />
                        <button 
                          class="citation-create-btn" 
                          :disabled="!isValidUrl3"
                          @click="createCitation3"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </article>

        <!-- Suggestions Sidebar (Right) - Only visible in Edit mode with suggestions -->
        <aside 
          v-if="isEditMode && showSuggestions && !isMinervaSkin && (availableSuggestionCount > 0 || (showSuggestionBadge && availableSuggestionCount === 0))" 
          class="suggestions-sidebar"
          :style="{ marginTop: `${suggestionsTopOffset}px` }"
        >
          <!-- First Add Citation Suggestion Card -->
          <div 
            v-if="showSuggestions && !showSuccessMessage1 && citationNumber1 === null && !isSuggestionDeclined1"
            ref="suggestionsSidebarRef"
            :class="{
              'suggestion-card--collapsed': !isCardExpanded,
              'suggestion-card--expanded': isCardExpanded,
              'suggestion-card--hover': isHovered
            }"
            class="suggestion-card suggestion-card-positioned"
            :style="{ top: `${sidebarTopOffset}px` }"
            @mouseenter="isCardHovered = true"
            @mouseleave="isCardHovered = false"
          >
            <!-- Collapsed state: just header -->
            <button 
              v-if="!isCardExpanded"
              class="suggestion-header suggestion-header--collapsed"
              @click="isCardExpanded = true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <!-- Expanded state: header + content -->
            <button 
              v-if="isCardExpanded"
              class="suggestion-header suggestion-header--expanded"
              @click="isCardExpanded = false"
              aria-expanded="true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <div v-if="isCardExpanded" class="suggestion-content">
              <p class="suggestion-description">
                Help readers understand where this information is coming from by adding a citation.
              </p>
              <div class="suggestion-actions">
                <button 
                  class="suggestion-btn" 
                  :disabled="showCitationPopup1"
                  @click="handleYesSuggestion1"
                >
                  Yes
                </button>
                <button 
                  class="suggestion-btn suggestion-btn-secondary" 
                  :disabled="showCitationPopup1"
                  @click="handleNoSuggestion1"
                >
                  No
                </button>
              </div>
            </div>
          </div>

          <!-- Success Message for Suggestion 1 -->
          <div 
            v-if="showSuggestions && showSuccessMessage1 && citationNumber1 !== null"
            ref="suggestionsSidebarRef"
            class="success-message"
            :style="{ top: `${sidebarTopOffset}px` }"
          >
            <div class="success-icon">
              <cdx-icon :icon="cdxIconSuccess" size="medium" />
            </div>
            <div class="success-content">
              <p class="success-text">Thank you for helping to make this section easier for people to read.</p>
            </div>
          </div>

          <!-- Second Add Citation Suggestion Card -->
          <div 
            v-if="showSuggestions && !showSuccessMessage2 && citationNumber2 === null && !isSuggestionDeclined2"
            ref="suggestionsSidebarRef2"
            :class="{
              'suggestion-card--collapsed': !isCardExpanded2,
              'suggestion-card--expanded': isCardExpanded2,
              'suggestion-card--hover': isHovered2
            }"
            class="suggestion-card suggestion-card-positioned"
            :style="{ top: `${sidebarTopOffset2}px` }"
            @mouseenter="isCardHovered2 = true"
            @mouseleave="isCardHovered2 = false"
          >
            <!-- Collapsed state: just header -->
            <button 
              v-if="!isCardExpanded2"
              class="suggestion-header suggestion-header--collapsed"
              @click="isCardExpanded2 = true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <!-- Expanded state: header + content -->
            <button 
              v-if="isCardExpanded2"
              class="suggestion-header suggestion-header--expanded"
              @click="isCardExpanded2 = false"
              aria-expanded="true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <div v-if="isCardExpanded2" class="suggestion-content">
              <p class="suggestion-description">
                Help readers understand where this information is coming from by adding a citation.
              </p>
              <div class="suggestion-actions">
                <button 
                  class="suggestion-btn" 
                  :disabled="showCitationPopup2"
                  @click="handleYesSuggestion2"
                >
                  Yes
                </button>
                <button 
                  class="suggestion-btn suggestion-btn-secondary" 
                  :disabled="showCitationPopup2"
                  @click="handleNoSuggestion2"
                >
                  No
                </button>
              </div>
            </div>
          </div>

          <!-- Success Message for Suggestion 2 -->
          <div 
            v-if="showSuggestions && showSuccessMessage2 && citationNumber2 !== null"
            ref="suggestionsSidebarRef2"
            class="success-message"
            :style="{ top: `${sidebarTopOffset2}px` }"
          >
            <div class="success-icon">
              <cdx-icon :icon="cdxIconSuccess" size="medium" />
            </div>
            <div class="success-content">
              <p class="success-text">Thank you for helping to make this section easier for people to read.</p>
            </div>
          </div>

          <!-- Third Add Citation Suggestion Card -->
          <div 
            v-if="showSuggestions && !showSuccessMessage3 && citationNumber3 === null && !isSuggestionDeclined3"
            ref="suggestionsSidebarRef3"
            :class="{
              'suggestion-card--collapsed': !isCardExpanded3,
              'suggestion-card--expanded': isCardExpanded3,
              'suggestion-card--hover': isHovered3
            }"
            class="suggestion-card suggestion-card-positioned"
            :style="{ top: `${sidebarTopOffset3}px` }"
            @mouseenter="isCardHovered3 = true"
            @mouseleave="isCardHovered3 = false"
          >
            <!-- Collapsed state: just header -->
            <button 
              v-if="!isCardExpanded3"
              class="suggestion-header suggestion-header--collapsed"
              @click="isCardExpanded3 = true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <!-- Expanded state: header + content -->
            <button 
              v-if="isCardExpanded3"
              class="suggestion-header suggestion-header--expanded"
              @click="isCardExpanded3 = false"
              aria-expanded="true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <div v-if="isCardExpanded3" class="suggestion-content">
              <p class="suggestion-description">
                Help readers understand where this information is coming from by adding a citation.
              </p>
              <div class="suggestion-actions">
                <button 
                  class="suggestion-btn" 
                  :disabled="showCitationPopup3"
                  @click="handleYesSuggestion3"
                >
                  Yes
                </button>
                <button 
                  class="suggestion-btn suggestion-btn-secondary" 
                  :disabled="showCitationPopup3"
                  @click="handleNoSuggestion3"
                >
                  No
                </button>
              </div>
            </div>
          </div>

          <!-- Success Message for Suggestion 3 -->
          <div 
            v-if="showSuggestions && showSuccessMessage3 && citationNumber3 !== null"
            ref="suggestionsSidebarRef3"
            class="success-message"
            :style="{ top: `${sidebarTopOffset3}px` }"
          >
            <div class="success-icon">
              <cdx-icon :icon="cdxIconSuccess" size="medium" />
            </div>
            <div class="success-content">
              <p class="success-text">Thank you for helping to make this section easier for people to read.</p>
            </div>
          </div>

          <!-- Empty State - Show when all suggestions are completed or declined -->
          <button
            v-if="showSuggestionBadge && !anySuggestionVisible && availableSuggestionCount > 0 && !showSuggestions"
            class="suggestions-viewport-notification"
            type="button"
            @click="handleBannerClick"
          >
            <span class="suggestions-viewport-number">{{ availableSuggestionCount }}</span>
            suggestions available for improving this article
          </button>
          <div 
            v-if="isMinervaSkin && ((showSuggestionBadge && availableSuggestionCount === 0) || (showSuggestions && allSuggestionsHandled && !showSuggestionNotification && !showSuggestionBadge))"
            class="empty-state"
          >
            <div v-if="!showSuggestionBadge" class="empty-state-icon">
              <cdx-icon :icon="cdxIconLightbulb" size="medium" />
            </div>
            <div class="empty-state-content">
              <p class="empty-state-text">
                {{ showSuggestionBadge ? '0 suggestions available for improving this article' : 'There are no suggestions to improve this article yet.' }}
              </p>
            </div>
          </div>
        </aside>

        <cdx-toggle-button
          v-if="isMinervaSkin && isEditMode && (showSuggestionToggle || (!showSuggestionToggle && !showSuggestions))"
          v-model="showSuggestions"
          quiet
          aria-label="Toggle suggestions"
          class="minerva-suggestions-toggle"
          :class="{ 'minerva-suggestions-toggle--active': showSuggestions }"
          :style="{ bottom: minervaToggleBottom }"
        >
          <span class="lightbulb-icon-wrapper">
            <span v-if="showSuggestions" class="bulb-rays">
              <span class="ray ray-1"></span>
              <span class="ray ray-2"></span>
              <span class="ray ray-3"></span>
              <span class="ray ray-4"></span>
              <span class="ray ray-5"></span>
            </span>
            <cdx-icon :icon="cdxIconLightbulb" size="medium" />
            <span
              v-if="showToggleBadge"
              class="suggestions-badge"
              :class="{ 'suggestions-badge--empty': availableSuggestionCount === 0 }"
            >
              {{ availableSuggestionCount }}
            </span>
          </span>
        </cdx-toggle-button>

        <div
          v-if="isMinervaSkin && isEditMode && showSuggestions && isMinervaSheetOpen && availableSuggestionCount > 0"
          class="minerva-bottom-sheet"
          role="dialog"
          aria-label="Suggestion"
          ref="minervaSheetRef"
        >
          <div class="minerva-sheet-header" :class="{ 'minerva-sheet-header--empty': shouldShowEmptyState }">
            <cdx-icon :icon="cdxIconLightbulb" size="medium" />
            <div class="minerva-sheet-title">{{ minervaSheetTitle }}</div>
            <button
              class="minerva-sheet-close"
              @click="closeMinervaSuggestion"
              aria-label="Close"
            >
              <cdx-icon :icon="cdxIconExpand" size="small" />
            </button>
          </div>
          <p v-if="shouldShowEmptyState && !showSuggestionNotification" class="minerva-empty-sheet-text">
            There are no suggestions to improve this article yet.
          </p>
          <p v-else class="minerva-sheet-description">
            Help readers understand where this information is coming from by adding a citation.
          </p>
          <div v-if="!shouldShowEmptyState" class="minerva-sheet-actions">
            <cdx-button
              v-if="activeMinervaSuggestion === 1"
              class="minerva-sheet-btn"
              action="default"
              weight="normal"
              :disabled="showCitationPopup1"
              @click="handleYesSuggestion1"
            >
              Yes
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 1"
              class="minerva-sheet-btn minerva-sheet-btn-secondary"
              action="default"
              weight="normal"
              :disabled="showCitationPopup1"
              @click="handleNoSuggestion1"
            >
              No
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 2"
              class="minerva-sheet-btn"
              action="default"
              weight="normal"
              :disabled="showCitationPopup2"
              @click="handleYesSuggestion2"
            >
              Yes
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 2"
              class="minerva-sheet-btn minerva-sheet-btn-secondary"
              action="default"
              weight="normal"
              :disabled="showCitationPopup2"
              @click="handleNoSuggestion2"
            >
              No
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 3"
              class="minerva-sheet-btn"
              action="default"
              weight="normal"
              :disabled="showCitationPopup3"
              @click="handleYesSuggestion3"
            >
              Yes
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 3"
              class="minerva-sheet-btn minerva-sheet-btn-secondary"
              action="default"
              weight="normal"
              :disabled="showCitationPopup3"
              @click="handleNoSuggestion3"
            >
              No
            </cdx-button>
          </div>
        </div>

        <!-- Tools Sidebar (Right) - Only visible in Read mode -->
        <aside v-if="!isEditMode" class="tools-sidebar">
          <div class="tools-container">
            <div class="tools-header">
              <h2 class="tools-title">Tools</h2>
              <button class="tools-toggle">hide</button>
            </div>

            <div class="tools-section">
              <div class="tools-section-title">General</div>
              <nav class="tools-nav">
                <a href="#" class="tools-link">What links here</a>
                <a href="#" class="tools-link">Related changes</a>
                <a href="#" class="tools-link">Special pages</a>
                <a href="#" class="tools-link">Permanent link</a>
                <a href="#" class="tools-link">Page information</a>
                <a href="#" class="tools-link">Cite this page</a>
                <a href="#" class="tools-link">Wikidata item</a>
                <a href="#" class="tools-link">Edit interlanguage links</a>
              </nav>
            </div>

            <div class="tools-section">
              <div class="tools-section-title">Print/export</div>
              <nav class="tools-nav">
                <a href="#" class="tools-link">Download as PDF</a>
                <a href="#" class="tools-link">Printable version</a>
              </nav>
            </div>

            <div class="tools-section">
              <div class="tools-section-title">In other projects</div>
              <nav class="tools-nav">
                <a href="#" class="tools-link">Wikimedia Commons</a>
                <a href="#" class="tools-link">Wikiquote</a>
                <a href="#" class="tools-link">Wikidata item</a>
              </nav>
            </div>
          </div>
        </aside>

        <div
          v-if="isPrototypeDialogOpen"
          class="prototype-dialog-backdrop"
          role="presentation"
          @click.self="closePrototypeDialog"
        >
          <div class="prototype-dialog" role="dialog" aria-modal="true" aria-label="Choose prototype">
            <div class="prototype-dialog-header">
              <h2 class="prototype-dialog-title">Choose prototype</h2>
            </div>
            <fieldset class="prototype-dialog-options" role="radiogroup" aria-label="Prototype options">
              <label class="prototype-radio">
                <input type="radio" value="editors-off" v-model="selectedPrototype">
                <span>Experience editors</span>
              </label>
              <label class="prototype-radio">
                <input type="radio" value="newcomers-on" v-model="selectedPrototype">
                <span>Newcomers</span>
              </label>
            </fieldset>
            <div class="prototype-dialog-actions">
              <button class="prototype-dialog-btn" @click="startPrototype">See prototype</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { CdxTypeaheadSearch, CdxIcon, CdxButton, CdxProgressBar, CdxToggleButton } from '@wikimedia/codex';
import {
  cdxIconMenu,
  cdxIconBell,
  cdxIconTray,
  cdxIconWatchlist,
  cdxIconUserAvatar,
  cdxIconExpand,
  cdxIconLanguage,
  cdxIconStar,
  cdxIconNext,
  cdxIconEllipsis,
  cdxIconHistory,
  cdxIconSearch,
  cdxIconListBullet,
  cdxIconUndo,
  cdxIconRedo,
  cdxIconTextStyle,
  cdxIconLink,
  cdxIconQuotes,
  cdxIconAdd,
  cdxIconSpecialCharacter,
  cdxIconHelp,
  cdxIconAlert,
  cdxIconEdit,
  cdxIconPuzzle,
  cdxIconLightbulb,
  cdxIconClock,
  cdxIconArticle,
  cdxIconClose,
  cdxIconSuccess
} from '@wikimedia/codex-icons';
import lordeImage from '../assets/lorde-1980.png';

// Wikipedia logo - solo el globo
const wikipediaGlobe = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png";

// Audre Lorde photo - local asset
const audreImage = lordeImage;

// TypeaheadSearch state
const searchResults = ref([]);
const searchFooterUrl = ref('');
const currentSearchTerm = ref('');
const pageRoot = ref(null);

// Edit mode state
const isEditMode = ref(false);
const hasUnsavedChanges = ref(false);
const isLoading = ref(false);
const showSuggestions = ref(true);
const enableAutoScroll = ref(false);
const showSuggestionNotification = ref(false);
const showSuggestionToggle = ref(true);
const isBannerDismissed = ref(false);
const isBannerDelayReady = ref(false);
const isBannerClosing = ref(false);
const isBannerOpening = ref(false);
const isEditToolbarScrolled = ref(false);
const isSuggestionLightFlash = ref(false);
const minervaSuccessRef = ref(null);
let bannerDelayTimer = null;
let bannerCloseTimer = null;
let bannerOpenTimer = null;
let suggestionLightTimer = null;
const isSkinMenuOpen = ref(false);
const selectedSkin = ref('vector22');
const isMinervaSkin = computed(() => selectedSkin.value === 'minerva');
const minervaOpenSections = ref({
  'early-life': false,
  career: false,
  poetry: false,
  prose: false
});
const editSnapshot = ref([]);
const isMinervaSheetOpen = ref(false);
const activeMinervaSuggestion = ref(1);
const minervaSheetRef = ref(null);
const minervaSheetHeight = ref(0);

// First suggestion card states
const isCardExpanded = ref(false);
const isCardHovered = ref(false);
const isTextHovered = ref(false);

// Refs for alignment (first suggestion)
const highlightedTextRef = ref(null);
const suggestionsSidebarRef = ref(null);
const sidebarTopOffset = ref(0);
const articleFirstSectionRef = ref(null);
const suggestionsTopOffset = ref(0);

// Computed: sincronizar hover entre texto y card (first suggestion)
const isHovered = computed(() => isCardHovered.value || isTextHovered.value);

// Second suggestion card states
const isCardExpanded2 = ref(false);
const isCardHovered2 = ref(false);
const isTextHovered2 = ref(false);

// Refs for alignment (second suggestion)
const highlightedTextRef2 = ref(null);
const suggestionsSidebarRef2 = ref(null);
const sidebarTopOffset2 = ref(0);

// Computed: sincronizar hover entre texto y card (second suggestion)
const isHovered2 = computed(() => isCardHovered2.value || isTextHovered2.value);

// Third suggestion card states
const isCardExpanded3 = ref(false);
const isCardHovered3 = ref(false);
const isTextHovered3 = ref(false);

// Refs for alignment (third suggestion)
const highlightedTextRef3 = ref(null);
const suggestionsSidebarRef3 = ref(null);
const sidebarTopOffset3 = ref(0);

// Computed: sincronizar hover entre texto y card (third suggestion)
const isHovered3 = computed(() => isCardHovered3.value || isTextHovered3.value);

// Citation flow states
const showCitationPopup1 = ref(false);
const showCitationPopup2 = ref(false);
const showCitationPopup3 = ref(false);
const citationUrl1 = ref('');
const citationUrl2 = ref('');
const citationUrl3 = ref('');
const citationNumber1 = ref(null); // null = no citation, number = citation created
const citationNumber2 = ref(null);
const citationNumber3 = ref(null);
const citationCounter = ref(0); // Global counter for citations
const showSuccessMessage1 = ref(false); // Show success message after citation is created
const showSuccessMessage2 = ref(false);
const showSuccessMessage3 = ref(false);
const isSuggestionDeclined1 = ref(false); // Track if suggestion was declined/skipped
const isSuggestionDeclined2 = ref(false);
const isSuggestionDeclined3 = ref(false);
const isPrototypeDialogOpen = ref(false);
const selectedPrototype = ref('newcomers-on');
const showSuggestionBadge = ref(false);
const pendingScrollSection = ref(null);
const editSectionEarlyLife = ref(null);
const editSectionCareer = ref(null);
const editSectionPoetry = ref(null);
const editSectionProse = ref(null);

// Computed properties to validate URLs
const isValidUrl1 = computed(() => {
  const url = citationUrl1.value.trim();
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
});

const isValidUrl2 = computed(() => {
  const url = citationUrl2.value.trim();
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
});

const isValidUrl3 = computed(() => {
  const url = citationUrl3.value.trim();
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
});

// Check if all suggestions have been handled (completed or declined)
const allSuggestionsHandled = computed(() => {
  const suggestion1Handled = citationNumber1.value !== null || isSuggestionDeclined1.value;
  const suggestion2Handled = citationNumber2.value !== null || isSuggestionDeclined2.value;
  const suggestion3Handled = citationNumber3.value !== null || isSuggestionDeclined3.value;
  return suggestion1Handled && suggestion2Handled && suggestion3Handled;
});

// Computed property to check if all suggestions are completed or declined (show empty state)
const showEmptyState = computed(() => {
  const suggestion1Done = citationNumber1.value !== null || isSuggestionDeclined1.value;
  const suggestion2Done = citationNumber2.value !== null || isSuggestionDeclined2.value;
  const suggestion3Done = citationNumber3.value !== null || isSuggestionDeclined3.value;
  return suggestion1Done && suggestion2Done && suggestion3Done;
});
const shouldShowEmptyState = computed(() => showSuggestions.value && showEmptyState.value);
const availableSuggestionCount = computed(() => {
  const suggestion1Pending = citationNumber1.value === null && !isSuggestionDeclined1.value && !showSuccessMessage1.value;
  const suggestion2Pending = citationNumber2.value === null && !isSuggestionDeclined2.value && !showSuccessMessage2.value;
  const suggestion3Pending = citationNumber3.value === null && !isSuggestionDeclined3.value && !showSuccessMessage3.value;
  return (suggestion1Pending ? 1 : 0) + (suggestion2Pending ? 1 : 0) + (suggestion3Pending ? 1 : 0);
});
const showToolbarToggle = computed(() => (
  !isMinervaSkin.value &&
  (showSuggestionToggle.value || (!showSuggestionToggle.value && !showSuggestions.value))
));
const showToggleBadge = computed(() => (
  availableSuggestionCount.value > 0 &&
  !shouldShowBanner.value &&
  !showSuggestions.value
));
const minervaSheetTitle = computed(() => {
  if (shouldShowEmptyState.value) return 'No suggestions';
  return 'Add a citation';
});
const minervaToggleBottom = computed(() => {
  return '16px';
});
const anySuggestionVisible = ref(false);
const shouldShowBanner = computed(() => {
  if (!showSuggestionNotification.value) return false;
  if (!showSuggestionToggle.value && !showSuggestions.value) return false;
  if (showSuggestionToggle.value && !showSuggestions.value) return false;
  return !anySuggestionVisible.value;
});
const bannerTextSuffix = computed(() => {
  if (!showSuggestionToggle.value) {
    return 'available for improving this article';
  }
  return isMinervaSkin.value
    ? 'available'
    : 'available for improving this article';
});
const bannerCountLabel = computed(() => (
  availableSuggestionCount.value === 1 ? 'suggestion' : 'suggestions'
));
const bannerTextRemainder = computed(() => bannerTextSuffix.value);
const bannerButtonLabel = computed(() => {
  if (isMinervaSkin.value && !showSuggestionToggle.value) {
    return showSuggestions.value ? 'Hide' : 'Show';
  }
  return showSuggestions.value ? 'Hide suggestions' : 'Show suggestions';
});
const showMinervaSuccessMessage = computed(() => (
  showSuccessMessage1.value || showSuccessMessage2.value || showSuccessMessage3.value
));

function resetSuggestionState() {
  showCitationPopup1.value = false;
  showCitationPopup2.value = false;
  citationUrl1.value = '';
  citationUrl2.value = '';
  citationNumber1.value = null;
  citationNumber2.value = null;
  citationCounter.value = 0;
  showSuccessMessage1.value = false;
  showSuccessMessage2.value = false;
  isSuggestionDeclined1.value = false;
  isSuggestionDeclined2.value = false;
  isCardExpanded.value = false;
  isCardExpanded2.value = false;
  isCardHovered.value = false;
  isCardHovered2.value = false;
  isTextHovered.value = false;
  isTextHovered2.value = false;
  isBannerDismissed.value = false;
  isBannerClosing.value = false;
  isBannerOpening.value = false;
  closeMinervaSuggestion();
}

function applyPrototypeMode(mode) {
  resetSuggestionState();
  showSuggestionNotification.value = true;
  showSuggestionBadge.value = mode === 'newcomers-on';
  isBannerDismissed.value = false;
  isBannerClosing.value = false;
  isBannerOpening.value = false;
  isBannerDelayReady.value = false;
  enableAutoScroll.value = false;
  showSuggestions.value = mode === 'newcomers-on';
  showSuggestionToggle.value = true;
}

function openPrototypeDialog() {
  if (isEditMode.value) return;
  isPrototypeDialogOpen.value = true;
}

function closePrototypeDialog() {
  isPrototypeDialogOpen.value = false;
}

function startPrototype() {
  applyPrototypeMode(selectedPrototype.value);
  closePrototypeDialog();
  enterEditMode();
}

function openEditAtSection(sectionId) {
  pendingScrollSection.value = sectionId;
  openPrototypeDialog();
}

function handleHideSuggestionsBanner() {
  showSuggestions.value = !showSuggestions.value;
}

function handleBannerToggleClick() {
  showSuggestions.value = !showSuggestions.value;
}

function handleBannerClose() {
  if (isBannerClosing.value || isBannerDismissed.value) return;
  isBannerClosing.value = true;
  if (bannerCloseTimer) {
    clearTimeout(bannerCloseTimer);
  }
  bannerCloseTimer = setTimeout(() => {
    isBannerDismissed.value = true;
    isBannerClosing.value = false;
    bannerCloseTimer = null;
  }, 220);
}

function handleBannerClick() {
  if (!showSuggestions.value) {
    showSuggestions.value = true;
  }
  nextTick(() => {
    scrollToNearestSuggestionFromBanner();
  });
}

function handleBannerKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleBannerClick();
  }
}

const editSectionRefs = {
  'early-life': editSectionEarlyLife,
  career: editSectionCareer,
  poetry: editSectionPoetry,
  prose: editSectionProse
};

function scrollToEditSection(sectionId) {
  const targetRef = editSectionRefs[sectionId];
  if (targetRef && targetRef.value) {
    targetRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function updateSuggestionVisibility() {
  if (!showSuggestions.value) {
    anySuggestionVisible.value = false;
    return;
  }
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const isVisible = (el) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < viewportHeight;
  };
  const successVisible =
    (showSuccessMessage1.value && isVisible(suggestionsSidebarRef.value)) ||
    (showSuccessMessage2.value && isVisible(suggestionsSidebarRef2.value)) ||
    (showSuccessMessage3.value && isVisible(suggestionsSidebarRef3.value)) ||
    (showMinervaSuccessMessage.value && isVisible(minervaSuccessRef.value));
  anySuggestionVisible.value =
    successVisible ||
    isVisible(highlightedTextRef.value) ||
    isVisible(highlightedTextRef2.value) ||
    isVisible(highlightedTextRef3.value);
}

function updateEditToolbarScrolled() {
  if (typeof window === 'undefined') return;
  isEditToolbarScrolled.value = window.scrollY > 0;
}

function handleReadClick() {
  closePrototypeDialog();
  if (isEditMode.value) {
    exitEditMode();
  }
}

// Function to handle "Yes" click on suggestion 1
function handleYesSuggestion1() {
  showCitationPopup1.value = true;
}

// Function to handle "Yes" click on suggestion 2
function handleYesSuggestion2() {
  showCitationPopup2.value = true;
}

// Function to handle "Yes" click on suggestion 3
function handleYesSuggestion3() {
  showCitationPopup3.value = true;
}

// Function to handle "No" click on suggestion 1 (decline/skip)
function handleNoSuggestion1() {
  isSuggestionDeclined1.value = true;
  isCardExpanded.value = false;
  closeMinervaSuggestion();
}

// Function to handle "No" click on suggestion 2 (decline/skip)
function handleNoSuggestion2() {
  isSuggestionDeclined2.value = true;
  isCardExpanded2.value = false;
  closeMinervaSuggestion();
}

// Function to handle "No" click on suggestion 3 (decline/skip)
function handleNoSuggestion3() {
  isSuggestionDeclined3.value = true;
  isCardExpanded3.value = false;
  closeMinervaSuggestion();
}

// Function to create citation for suggestion 1
function createCitation1() {
  if (citationUrl1.value.trim()) {
    citationCounter.value++;
    citationNumber1.value = citationCounter.value;
    showCitationPopup1.value = false;
    closeMinervaSuggestion();
    // Show success message instead of suggestion card
    showSuccessMessage1.value = true;
    // Hide success message after 4 seconds
    setTimeout(() => {
      showSuccessMessage1.value = false;
      nextTick(() => {
        updateSuggestionVisibility();
      });
    }, 4000);
  }
}

// Function to create citation for suggestion 2
function createCitation2() {
  if (citationUrl2.value.trim()) {
    citationCounter.value++;
    citationNumber2.value = citationCounter.value;
    showCitationPopup2.value = false;
    closeMinervaSuggestion();
    // Show success message instead of suggestion card
    showSuccessMessage2.value = true;
    // Hide success message after 4 seconds
    setTimeout(() => {
      showSuccessMessage2.value = false;
      nextTick(() => {
        updateSuggestionVisibility();
      });
    }, 4000);
  }
}

// Function to create citation for suggestion 3
function createCitation3() {
  if (citationUrl3.value.trim()) {
    citationCounter.value++;
    citationNumber3.value = citationCounter.value;
    showCitationPopup3.value = false;
    closeMinervaSuggestion();
    // Show success message instead of suggestion card
    showSuccessMessage3.value = true;
    // Hide success message after 4 seconds
    setTimeout(() => {
      showSuccessMessage3.value = false;
      nextTick(() => {
        updateSuggestionVisibility();
      });
    }, 4000);
  }
}

// Watch to ensure only one suggestion is expanded at a time
watch(isCardExpanded, (newValue) => {
  if (newValue) {
    isCardExpanded2.value = false;
    isCardExpanded3.value = false;
  }
});

watch(isCardExpanded2, (newValue) => {
  if (newValue) {
    isCardExpanded.value = false;
    isCardExpanded3.value = false;
  }
});

watch(isCardExpanded3, (newValue) => {
  if (newValue) {
    isCardExpanded.value = false;
    isCardExpanded2.value = false;
  }
});

// Function to calculate and align sidebar with highlighted text
function alignSidebarWithText() {
  if (!highlightedTextRef.value) return;
  
  nextTick(() => {
    // Get the main-content-area container
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    
    const textRect = highlightedTextRef.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    
    // Calculate the offset of highlighted text from the top of main-content-area
    const offset = textRect.top - containerRect.top - suggestionsTopOffset.value;
    sidebarTopOffset.value = offset;
  });
}

// Watch for changes in showSuggestions to realign
watch(showSuggestions, (newValue) => {
  if (newValue) {
    nextTick(() => {
      alignSidebarWithText();
    });
  } else {
    sidebarTopOffset.value = 0;
  }
});

// Watch for changes in isEditMode to realign
watch(isEditMode, (newValue) => {
  if (newValue && showSuggestions.value) {
    nextTick(() => {
      alignBothSuggestions();
    });
  }
});

// Function to calculate and align second sidebar with highlighted text
function alignSidebarWithText2() {
  if (!highlightedTextRef2.value) return;
  
  nextTick(() => {
    // Get the main-content-area container
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    
    const textRect = highlightedTextRef2.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    
    // Calculate the offset of highlighted text from the top of main-content-area
    const offset = textRect.top - containerRect.top - suggestionsTopOffset.value;
    sidebarTopOffset2.value = offset;
  });
}

// Function to calculate and align third sidebar with highlighted text
function alignSidebarWithText3() {
  if (!highlightedTextRef3.value) return;
  
  nextTick(() => {
    // Get the main-content-area container
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    
    const textRect = highlightedTextRef3.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    
    // Calculate the offset of highlighted text from the top of main-content-area
    const offset = textRect.top - containerRect.top - suggestionsTopOffset.value;
    sidebarTopOffset3.value = offset;
  });
}

function alignSuggestionsContainer() {
  if (!articleFirstSectionRef.value) return;

  nextTick(() => {
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;

    const sectionRect = articleFirstSectionRef.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    const offset = sectionRect.top - containerRect.top;
    suggestionsTopOffset.value = Math.max(0, offset);
  });
}

// Function to align both suggestions
function alignBothSuggestions() {
  alignSuggestionsContainer();
  alignSidebarWithText();
  alignSidebarWithText2();
  alignSidebarWithText3();
}

// Watch for changes in showSuggestions to realign both
watch(showSuggestions, (newValue) => {
  if (newValue) {
    isBannerDismissed.value = false;
    if (showSuggestionToggle.value) {
      isBannerDelayReady.value = false;
      if (bannerDelayTimer) {
        clearTimeout(bannerDelayTimer);
      }
      bannerDelayTimer = setTimeout(() => {
        if (isEditMode.value && showSuggestions.value) {
          isBannerDelayReady.value = true;
        }
      }, 1000);
    }
    nextTick(() => {
      alignBothSuggestions();
      updateSuggestionVisibility();
    });
  } else {
    sidebarTopOffset.value = 0;
    sidebarTopOffset2.value = 0;
    sidebarTopOffset3.value = 0;
    suggestionsTopOffset.value = 0;
    closeMinervaSuggestion();
  }
});

watch(showSuggestions, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    isSuggestionLightFlash.value = true;
    if (suggestionLightTimer) {
      clearTimeout(suggestionLightTimer);
    }
    suggestionLightTimer = setTimeout(() => {
      isSuggestionLightFlash.value = false;
      suggestionLightTimer = null;
    }, 900);
  }
});

watch(
  () => [showSuggestions.value, showEmptyState.value, isMinervaSkin.value],
  ([suggestionsActive, emptyActive, isMinerva]) => {
    if (isMinerva && suggestionsActive && emptyActive) {
      isMinervaSheetOpen.value = true;
    }
  }
);

watch(isMinervaSheetOpen, () => {
  updateMinervaSheetHeight();
});

watch(
  () => [showSuggestions.value, showSuggestionNotification.value],
  () => {
    nextTick(() => {
      updateSuggestionVisibility();
    });
  }
);

watch(
  () => [
    citationNumber1.value,
    citationNumber2.value,
    citationNumber3.value,
    isSuggestionDeclined1.value,
    isSuggestionDeclined2.value,
    isSuggestionDeclined3.value
  ],
  () => {
    nextTick(() => {
      updateSuggestionVisibility();
    });
  }
);

watch(availableSuggestionCount, (newValue, oldValue) => {
  if (oldValue !== undefined && newValue !== oldValue) {
    isBannerDismissed.value = false;
  }
});

watch(isLoading, (newValue) => {
  if (!newValue && isEditMode.value) {
    if (bannerDelayTimer) {
      clearTimeout(bannerDelayTimer);
    }
    bannerDelayTimer = setTimeout(() => {
      if (isEditMode.value && !isLoading.value) {
        isBannerDelayReady.value = true;
      }
    }, 1000);
  }
});


// Auto scroll/expand helper
let autoSuggestionTimer = null;

function clearAutoSuggestionTimer() {
  if (autoSuggestionTimer) {
    clearTimeout(autoSuggestionTimer);
    autoSuggestionTimer = null;
  }
}

function isTargetVisibleInViewport(target) {
  if (!target || typeof window === 'undefined') return false;
  const rect = target.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.bottom > 0 && rect.top < viewportHeight;
}

function scrollToSuggestionIfNeeded(targetRef) {
  nextTick(() => {
    const target = targetRef.value;
    if (target && !isTargetVisibleInViewport(target)) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

function openSuggestionAtTarget(id, targetRef, expandAfterScroll = false) {
  const openSuggestion = (suggestionId) => {
    if (isMinervaSkin.value) {
      openMinervaSuggestion(suggestionId);
      return;
    }
    if (suggestionId === 1) {
      isCardExpanded.value = true;
      isCardExpanded2.value = false;
      isCardExpanded3.value = false;
    } else if (suggestionId === 2) {
      isCardExpanded2.value = true;
      isCardExpanded.value = false;
      isCardExpanded3.value = false;
    } else {
      isCardExpanded.value = false;
      isCardExpanded2.value = false;
      isCardExpanded3.value = true;
    }
  };

  if (expandAfterScroll) {
    const target = targetRef.value;
    const shouldScroll = target && !isTargetVisibleInViewport(target);
    if (shouldScroll) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        openSuggestion(id);
      }, 1000);
      return;
    }
  }
  openSuggestion(id);
  scrollToSuggestionIfNeeded(targetRef);
}

function getPendingSuggestionTargets() {
  const targets = [];
  if (citationNumber1.value === null && !isSuggestionDeclined1.value && !showSuccessMessage1.value && highlightedTextRef.value) {
    targets.push({ id: 1, ref: highlightedTextRef });
  }
  if (citationNumber2.value === null && !isSuggestionDeclined2.value && !showSuccessMessage2.value && highlightedTextRef2.value) {
    targets.push({ id: 2, ref: highlightedTextRef2 });
  }
  if (citationNumber3.value === null && !isSuggestionDeclined3.value && !showSuccessMessage3.value && highlightedTextRef3.value) {
    targets.push({ id: 3, ref: highlightedTextRef3 });
  }
  return targets;
}

function getCurrentSectionId(currentY) {
  const sections = [
    { id: 'early-life', ref: editSectionEarlyLife },
    { id: 'career', ref: editSectionCareer },
    { id: 'poetry', ref: editSectionPoetry },
    { id: 'prose', ref: editSectionProse }
  ].filter((section) => section.ref.value);

  if (!sections.length) {
    return null;
  }

  const positions = sections.map((section) => ({
    id: section.id,
    top: section.ref.value.getBoundingClientRect().top + window.scrollY
  }));

  positions.sort((a, b) => a.top - b.top);

  let currentSection = positions[0].id;
  for (let i = 0; i < positions.length; i++) {
    if (currentY >= positions[i].top) {
      currentSection = positions[i].id;
    } else {
      break;
    }
  }
  return currentSection;
}

function scrollToNearestSuggestionFromBanner() {
  if (!isEditMode.value || !showSuggestions.value) return;

  const pendingTargets = getPendingSuggestionTargets();
  if (!pendingTargets.length) return;

  const currentY = window.scrollY + window.innerHeight / 2;
  const sectionToSuggestion = {
    career: 1,
    poetry: 2,
    prose: 3
  };
  const currentSectionId = getCurrentSectionId(currentY);
  const sectionSuggestionId = sectionToSuggestion[currentSectionId];
  if (sectionSuggestionId) {
    const sameSectionTarget = pendingTargets.find((target) => target.id === sectionSuggestionId);
    if (sameSectionTarget) {
      openSuggestionAtTarget(sameSectionTarget.id, sameSectionTarget.ref, true);
      return;
    }
  }

  const positionedTargets = pendingTargets
    .map((target) => ({
      ...target,
      top: target.ref.value.getBoundingClientRect().top + window.scrollY
    }))
    .sort((a, b) => a.top - b.top);

  const below = positionedTargets.filter((target) => target.top >= currentY);
  if (below.length) {
    openSuggestionAtTarget(below[0].id, below[0].ref, true);
    return;
  }

  const lastAbove = positionedTargets[positionedTargets.length - 1];
  openSuggestionAtTarget(lastAbove.id, lastAbove.ref, true);
}

function openFirstPendingSuggestion(expandAfterScroll = false) {
  if (!isEditMode.value || !showSuggestions.value) return;

  const suggestion1Pending = citationNumber1.value === null && !isSuggestionDeclined1.value && !showSuccessMessage1.value;
  const suggestion2Pending = citationNumber2.value === null && !isSuggestionDeclined2.value && !showSuccessMessage2.value;
  const suggestion3Pending = citationNumber3.value === null && !isSuggestionDeclined3.value && !showSuccessMessage3.value;

  if (suggestion1Pending) {
    openSuggestionAtTarget(1, highlightedTextRef, expandAfterScroll);
  } else if (suggestion2Pending) {
    openSuggestionAtTarget(2, highlightedTextRef2, expandAfterScroll);
  } else if (suggestion3Pending) {
    openSuggestionAtTarget(3, highlightedTextRef3, expandAfterScroll);
  }
}

// Auto expand and scroll when edit mode + suggestions activate
watch(
  () => [isEditMode.value, showSuggestions.value],
  ([editActive, suggestionsActive]) => {
    clearAutoSuggestionTimer();
    if (editActive && suggestionsActive && enableAutoScroll.value) {
      autoSuggestionTimer = setTimeout(() => {
        openFirstPendingSuggestion();
      }, 1200);
    }
  }
);

watch(
  () => [showSuggestions.value, showSuggestionToggle.value, showSuggestionNotification.value],
  ([suggestionsActive, hasToggle, hasBanner], [prevSuggestionsActive]) => {
    if (!hasToggle || !hasBanner) return;
    if (!prevSuggestionsActive && suggestionsActive && availableSuggestionCount.value > 0) {
      if (bannerOpenTimer) {
        clearTimeout(bannerOpenTimer);
      }
      isBannerOpening.value = true;
      bannerOpenTimer = setTimeout(() => {
        isBannerOpening.value = false;
        bannerOpenTimer = null;
      }, 220);
    }
  }
);

watch(
  () => isLoading.value,
  (loading) => {
    if (!loading && pendingScrollSection.value) {
      const target = pendingScrollSection.value;
      pendingScrollSection.value = null;
      nextTick(() => {
        scrollToEditSection(target);
      });
    }
  }
);

// Align on mount and add event listeners
onMounted(() => {
  if (typeof window !== 'undefined') {
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    selectedSkin.value = isMobile ? 'minerva' : 'vector22';
  }

  if (isEditMode.value && showSuggestions.value) {
    setTimeout(() => {
      alignBothSuggestions();
      updateSuggestionVisibility();
    }, 100);
  }
  
  if (typeof window !== 'undefined') {
    // Add event listeners to keep alignment updated for both suggestions
    window.addEventListener('resize', alignBothSuggestions);
    window.addEventListener('scroll', alignBothSuggestions, true); // true for capture phase
    window.addEventListener('resize', updateMinervaSheetHeight);
    window.addEventListener('scroll', updateSuggestionVisibility, true);
    window.addEventListener('resize', updateSuggestionVisibility);
    window.addEventListener('scroll', updateEditToolbarScrolled, true);
    updateEditToolbarScrolled();
  }
});

// Clean up event listeners
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', alignBothSuggestions);
    window.removeEventListener('scroll', alignBothSuggestions, true);
    window.removeEventListener('resize', updateMinervaSheetHeight);
    window.removeEventListener('scroll', updateSuggestionVisibility, true);
    window.removeEventListener('resize', updateSuggestionVisibility);
    window.removeEventListener('scroll', updateEditToolbarScrolled, true);
  }
  clearAutoSuggestionTimer();
  if (bannerCloseTimer) {
    clearTimeout(bannerCloseTimer);
    bannerCloseTimer = null;
  }
  if (bannerOpenTimer) {
    clearTimeout(bannerOpenTimer);
    bannerOpenTimer = null;
  }
  if (suggestionLightTimer) {
    clearTimeout(suggestionLightTimer);
    suggestionLightTimer = null;
  }
});

// Handle search input
function onSearchInput(value) {
  console.log('Search input:', value);
  
  // Track current search term
  currentSearchTerm.value = value;
  
  // Reset if empty
  if (!value || value === '') {
    searchResults.value = [];
    searchFooterUrl.value = '';
    return;
  }
  
  // Format API response for TypeaheadSearch
  function adaptApiResponse(pages) {
    return pages.map(({ id, key, title, description, thumbnail }) => ({
      label: title,
      value: id,
      description: description,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(key)}`,
      thumbnail: thumbnail ? {
        url: thumbnail.url,
        width: thumbnail.width,
        height: thumbnail.height
      } : undefined
    }));
  }
  
  // Fetch search results from Wikipedia API
  fetch(
    `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(value)}&limit=10`
  )
    .then((resp) => resp.json())
    .then((data) => {
      // Verify data is still relevant
      if (currentSearchTerm.value === value) {
        searchResults.value = data.pages && data.pages.length > 0 
          ? adaptApiResponse(data.pages) 
          : [];
        
        searchFooterUrl.value = `https://en.wikipedia.org/w/index.php?title=Special%3ASearch&fulltext=1&search=${encodeURIComponent(value)}`;
      }
    })
    .catch(() => {
      searchResults.value = [];
      searchFooterUrl.value = '';
    });
}

// Handle search result click
function onSearchResultClick(value) {
  console.log('Search result clicked:', value);
}

// Handle search submit
function onSearchSubmit(value) {
  console.log('Search submitted:', value);
}

// Toggle edit mode with loading state
function enterEditMode() {
  // Activating edit mode: switch to edit mode immediately and show loading overlay
  isEditMode.value = true;
  isSkinMenuOpen.value = false;
  isLoading.value = true;
  hasUnsavedChanges.value = false;
  nextTick(() => {
    captureEditSnapshot();
  });
  isBannerDelayReady.value = false;
  isBannerClosing.value = false;
  isBannerOpening.value = false;
  
  // Hide loading overlay after 2 seconds
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
}

function exitEditMode() {
  // Returning to read mode: no loading
  restoreEditSnapshot();
  hasUnsavedChanges.value = false;
  closeMinervaSuggestion();
  isEditMode.value = false;
  isBannerDelayReady.value = false;
  isBannerClosing.value = false;
  isBannerOpening.value = false;
  if (bannerDelayTimer) {
    clearTimeout(bannerDelayTimer);
    bannerDelayTimer = null;
  }
  if (bannerCloseTimer) {
    clearTimeout(bannerCloseTimer);
    bannerCloseTimer = null;
  }
  if (bannerOpenTimer) {
    clearTimeout(bannerOpenTimer);
    bannerOpenTimer = null;
  }
}

function toggleEditMode() {
  if (!isEditMode.value) {
    openPrototypeDialog();
    return;
  }
  exitEditMode();
}

function toggleSkinMenu() {
  if (isEditMode.value) {
    return;
  }
  isSkinMenuOpen.value = !isSkinMenuOpen.value;
}

function toggleMinervaSection(sectionId) {
  minervaOpenSections.value[sectionId] = !minervaOpenSections.value[sectionId];
}

function isMinervaSectionOpen(sectionId) {
  return Boolean(minervaOpenSections.value[sectionId]);
}

function openMinervaSuggestion(suggestionId) {
  activeMinervaSuggestion.value = suggestionId;
  isMinervaSheetOpen.value = true;
  if (suggestionId === 1) {
    isCardExpanded.value = true;
    isCardExpanded2.value = false;
    isCardExpanded3.value = false;
  } else if (suggestionId === 2) {
    isCardExpanded2.value = true;
    isCardExpanded.value = false;
    isCardExpanded3.value = false;
  } else {
    isCardExpanded3.value = true;
    isCardExpanded.value = false;
    isCardExpanded2.value = false;
  }
  updateMinervaSheetHeight();
}

function closeMinervaSuggestion() {
  isMinervaSheetOpen.value = false;
  isCardExpanded.value = false;
  isCardExpanded2.value = false;
  isCardExpanded3.value = false;
  minervaSheetHeight.value = 0;
}

function updateMinervaSheetHeight() {
  if (!isMinervaSheetOpen.value) {
    minervaSheetHeight.value = 0;
    return;
  }
  nextTick(() => {
    const sheet = minervaSheetRef.value;
    if (sheet) {
      minervaSheetHeight.value = sheet.offsetHeight;
    }
  });
}

function captureEditSnapshot() {
  if (!pageRoot.value) {
    return;
  }
  const nodes = pageRoot.value.querySelectorAll('.article-text-editable');
  editSnapshot.value = Array.from(nodes).map((node) => ({
    node,
    html: node.innerHTML
  }));
}

function restoreEditSnapshot() {
  if (!editSnapshot.value.length) {
    return;
  }
  editSnapshot.value.forEach(({ node, html }) => {
    if (node) {
      node.innerHTML = html;
    }
  });
}

function undoEdits() {
  restoreEditSnapshot();
  hasUnsavedChanges.value = false;
}

// Mark article as edited
function markArticleEdited() {
  hasUnsavedChanges.value = true;
}
</script>

<style scoped>
/* Root container */
.read-mode {
  background-color: white;
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.page-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 12px 0;
  width: 100%;
  max-width: 1596px;
  margin: 0 auto;
}

.minerva-skin .page-container {
  max-width: 994px;
  padding-top: 0;
}

/* ===== HEADER ===== */
.header-section {
  padding: 0 32px;
  width: 100%;
}

.header {
  background-color: rgba(255, 255, 255, 0);
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.menu-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 5px 13px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #202122;
}

.menu-button:hover {
  background-color: #f8f9fa;
}

.header-section--minerva {
  padding: 0 16px;
  background-color: #eaecf0;
  border-bottom: 1px solid #c8ccd1;
}

.minerva-skin.edit-mode .header-section {
  display: none;
}

.header--minerva {
  background-color: transparent;
  height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.minerva-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header--minerva .menu-button {
  position: static;
  transform: none;
}

.menu-button--minerva {
  padding: 4px 8px;
}

.minerva-brand {
  display: flex;
  align-items: center;
  font-family: 'Linux Libertine', 'Georgia', 'Times', serif;
  color: #54595d;
}

.minerva-brand-text {
  width: 120px;
  font-size: 20px;
  letter-spacing: 0.6px;
  font-variant: small-caps;
}

.minerva-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header--minerva .icon-btn {
  color: var(--color-subtle, #54595d);
}

.menu-popup {
  position: absolute;
  left: 0;
  top: calc(50% + 22px);
  background-color: #ffffff;
  border: 1px solid #a2a9b1;
  border-radius: 4px;
  padding: 10px 12px;
  display: grid;
  gap: 8px;
  min-width: 220px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.menu-popup--minerva {
  top: calc(100% + 6px);
}

.menu-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #202122;
  cursor: pointer;
}

.menu-radio input {
  cursor: pointer;
}

/* Wikipedia Logo */
.wikipedia-logo {
  position: absolute;
  left: 58px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
}

.wikipedia-globe {
  height: 50px;
  width: auto;
}

.wikipedia-text {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.wikipedia-title {
  font-family: 'Linux Libertine', 'Georgia', 'Times', serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
  color: #202122;
  letter-spacing: 0.5px;
}

.wikipedia-tagline {
  font-family: 'Linux Libertine', 'Georgia', 'Times', serif;
  font-size: 12px;
  line-height: 1.2;
  color: #202122;
}

/* Search */
.search-container {
  position: absolute;
  left: 294px;
  right: 538px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

/* TypeaheadSearch overrides for header integration */
.search-container :deep(.cdx-typeahead-search) {
  width: 100%;
}

.search-container :deep(.cdx-search-input) {
  width: 100%;
}

.search-container :deep(.cdx-text-input__input) {
  font-size: 14px;
  font-family: 'Inter', sans-serif;
}

.search-container :deep(.cdx-search-input__end-button) {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 14px;
}

/* User Tools */
.user-tools {
  position: absolute;
  right: 1.31px;
  top: calc(50% - 0.39px);
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-link {
  padding: 0 6px;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: #36c;
  text-decoration: none;
  border-radius: 2px;
}

.user-link:hover {
  text-decoration: underline;
}

.icon-btn {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 5px 7px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #202122;
}

.icon-btn:hover {
  background-color: #f8f9fa;
}

.user-menu-btn {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 6px 8px 6px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  color: #202122;
}

.user-menu-btn:hover {
  background-color: #f8f9fa;
}

/* ===== MAIN CONTENT AREA ===== */
.main-content-area {
  display: flex;
  gap: 24px;
  padding: 0 32px;
  align-items: flex-start;
  width: 100%;
}

.minerva-skin .main-content-area {
  padding: 0 16px;
  gap: 0;
}

.minerva-suggestions-on .main-content-area {
  padding-right: 0;
}

.minerva-skin .toc-sidebar,
.minerva-skin .tools-sidebar {
  display: none;
}

.minerva-skin .article {
  max-width: 100%;
}

/* ===== TABLE OF CONTENTS (LEFT SIDEBAR) ===== */
.toc-sidebar {
  width: 209px;
  flex-shrink: 0;
  padding-top: 56px;
  border-radius: 2px;
}

@media (max-width: 1119px) {
  .toc-sidebar {
    display: none;
  }
}

.toc-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toc-header {
  padding: 0 0 6px 20px;
  border-bottom: 1px solid #dadde3;
  display: flex;
  align-items: center;
  gap: 12px;
}

.toc-title {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
  margin: 0;
}

.toc-toggle {
  background-color: #eaecf0;
  border: none;
  border-radius: 2px;
  padding: 1px 6px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  line-height: 20px;
  color: #202122;
  cursor: pointer;
}

.toc-toggle:hover {
  background-color: #dadde3;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toc-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
}

.toc-item-no-chevron {
  padding-left: 26px;
}

.toc-expand {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.toc-expand :deep(.cdx-icon) {
  transition: transform 0.2s ease;
}

.toc-expand-open :deep(.cdx-icon) {
  transform: rotate(90deg);
}

.toc-link {
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #36c;
  text-decoration: none;
  border-radius: 2px;
  white-space: pre-wrap;
}

.toc-link:hover {
  text-decoration: underline;
}

.toc-link-bold {
  font-weight: bold;
  color: #202122;
}

.toc-sub-item {
  padding-left: 28px;
  width: 100%;
}

.toc-sub-item .toc-link {
  display: block;
}

/* ===== ARTICLE (CENTER COLUMN) ===== */
.article {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0; /* No gap between article-chrome and edit-mode-content */
  width: 100%;
  max-width: 1067px;
}

/* Article Chrome (Title + Toolbar) */
.article-chrome {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-toolbar {
  display: flex;
  flex-direction: column;
}

.minerva-title-toolbar {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 2px 0 6px;
}

.minerva-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #c8ccd1;
}

.minerva-article-title {
  color: var(--color-emphasized, #202122);
  font-family: 'Source Serif Pro', serif;
  font-size: var(--font-size-xxx-large, 28px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-height-xxx-large, 38px);
  margin: 0;
}

.minerva-language-button {
  display: none;
}

.minerva-tabs {
  display: flex;
  align-items: center;
  gap: 18px;
  border-bottom: 1px solid #c8ccd1;
  padding-bottom: 0;
}

.minerva-tab {
  border: none;
  background: transparent;
  color: var(--color-subtle, #54595d);
  padding: 0 0 5px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.minerva-tab--active {
  border-bottom-color: #202122;
}

.minerva-actions {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  align-items: center;
  border-bottom: 1px solid #c8ccd1;
  justify-items: center;
  margin-top: 0;
}

.minerva-action-btn {
  border: none;
  background: none;
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 4px;
  cursor: pointer;
  color: var(--color-subtle, #54595d);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.minerva-actions .minerva-action-btn:first-child {
  justify-self: start;
}

.minerva-actions .minerva-action-btn:last-child {
  justify-self: end;
}

.minerva-action-btn:hover {
  background-color: #eaecf0;
}

.minerva-ellipsis-icon :deep(svg) {
  transform: rotate(90deg);
}

.article-title-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-and-language {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.toc-toggle-btn {
  display: none;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #202122;
  border-radius: 2px;
}

.toc-toggle-btn:hover {
  background-color: #f8f9fa;
}

@media (max-width: 1119px) {
  .toc-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.article-title {
  flex: 1;
  font-family: 'Source Serif Pro', serif;
  font-weight: 400;
  font-size: 28px;
  line-height: 35px;
  color: #101418;
  margin: 0;
  white-space: pre-wrap;
}

@media (max-width: 1119px) {
  .title-and-language {
    gap: 8px;
  }
  
  .language-button {
    margin-left: auto;
  }
}

.language-button {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 5px 9px 5px 7px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.language-button:hover {
  background-color: #f8f9fa;
}

.language-button :deep(.cdx-icon) {
  color: #36c;
}

.language-text {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #36c;
}

.title-divider {
  height: 1px;
  background-color: #a2a9b1;
  width: 100%;
}

/* Toolbar */
.toolbar {
  display: flex;
  flex-direction: column;
}

.tabs {
  height: 43px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.tabs-start,
.tabs-end {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.tabs-end {
  margin-right: -6px;
}

.tools-toggle-btn {
  display: none;
  background: none;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  color: #202122;
  border-radius: 2px;
  gap: 4px;
  align-items: center;
}

.tools-toggle-btn:hover {
  background-color: #f8f9fa;
}

.tools-toggle-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
}

@media (max-width: 1119px) {
  .tools-toggle-btn {
    display: flex;
  }
}

.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 16px 0 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.tab-text {
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
  text-align: center;
  white-space: nowrap;
}

.tab-link {
  color: #36c;
  cursor: pointer;
}

.tab-link:hover {
  text-decoration: underline;
}

.tab-selected .tab-text {
  color: #202122;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #202122;
}

.tab-icon-btn {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 5px 13px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #202122;
  margin-bottom: 4px;
}

.tab-icon-btn:hover {
  background-color: #f8f9fa;
}

.toolbar-divider {
  height: 1px;
  background-color: #c8ccd1;
  width: 100%;
}

.article-tagline {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-size: 12.4px;
  line-height: 17.3px;
  color: #101418;
  margin: 0;
}

.article-tagline--minerva {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 12.4px;
  line-height: 17.3px;
  color: #101418;
  margin: 6px 0 2px;
}

/* Article Content */
.article-content-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.minerva-article-content {
  gap: 12px;
}

.minerva-first-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.minerva-intro {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #202122;
}

.minerva-intro p {
  margin: 0;
}

.minerva-article-content .body-text {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #202122;
}

.minerva-article-content .body-text a {
  color: #3366cc;
}

.minerva-skin a {
  color: var(--color-progressive, #36c);
  text-decoration: none;
}

.minerva-skin a:hover,
.minerva-skin a:active {
  text-decoration: underline;
}

.minerva-accordion {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.minerva-accordion-item {
  border-bottom: 1px solid #c8ccd1;
}

.minerva-accordion-item:first-child {
  border-top: 1px solid #c8ccd1;
}

.minerva-accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 58px;
}

.minerva-accordion-toggle {
  background: none;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-subtle, #54595d);
  cursor: pointer;
  padding: 0;
}

.minerva-accordion-toggle span {
  color: var(--color-emphasized, #202122);
  font-family: 'Source Serif Pro', serif;
  font-size: var(--font-size-xx-large, 21px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-height-xx-large, 27.3px);
}

.minerva-accordion-panel {
  padding: 0 0 12px;
}

.minerva-accordion-icon--open {
  transform: rotate(180deg);
}

.minerva-accordion-toggle :deep(svg) {
  transition: transform 0.2s ease;
}

.minerva-accordion-edit {
  border: none;
  background: none;
  color: var(--color-subtle, #54595d);
  padding: 4px;
  cursor: pointer;
}

.minerva-last-edited {
  margin-top: 8px;
  background-color: #3366cc;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 0;
  font-size: 12px;
}

.minerva-skin .minerva-last-edited :deep(.cdx-icon) {
  color: var(--color-inverted, #ffffff);
}

.minerva-last-edited-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.minerva-last-edited-title {
  font-weight: 600;
}

.minerva-last-edited-subtitle {
  opacity: 0.9;
}

.minerva-last-edited-arrow {
  margin-left: auto;
}

.minerva-related {
  margin-top: 16px;
}

.minerva-related-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #54595d;
  margin-bottom: 8px;
}

.minerva-related-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.minerva-related-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px;
  border: 1px solid #c8ccd1;
  border-radius: 6px;
  background: #ffffff;
}

.minerva-related-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.minerva-related-name {
  font-size: 13px;
  font-weight: 600;
  color: #202122;
}

.minerva-related-meta {
  font-size: 11px;
  color: #54595d;
}

.minerva-footer {
  margin-top: 24px;
  padding: 16px 0 24px;
  border-top: 1px solid #c8ccd1;
  color: #54595d;
}

.minerva-footer-brand {
  font-family: 'Linux Libertine', 'Georgia', 'Times', serif;
  font-size: 16px;
  margin-bottom: 6px;
}

.minerva-footer-meta {
  font-size: 11px;
  line-height: 16px;
}

.minerva-footer-meta a {
  color: #3366cc;
  text-decoration: none;
}

.minerva-footer-meta a:hover {
  text-decoration: underline;
}

.article-ve-contents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.article-content-grid {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

/* Article Text */
.article-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.intro-text,
.body-text {
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: #202122;
}

.intro-text p,
.body-text p {
  margin: 0;
  line-height: 22px;
}

.intro-text strong,
.body-text strong {
  font-weight: bold;
}

.intro-text a,
.body-text a {
  color: #36c;
  text-decoration: none;
}

.intro-text a:hover,
.body-text a:hover {
  text-decoration: underline;
}

/* Section Heading */
.section-heading {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-heading-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.heading-text {
  font-family: 'Source Serif Pro', serif;
  font-weight: 400;
  font-size: 21px;
  line-height: 27.3px;
  color: #202122;
  margin: 0;
  white-space: pre-wrap;
}

.section-edit {
  font-size: 12px;
  margin-left: 8px;
}

.section-edit-bracket {
  color: var(--color-subtle, #54595d);
}

.section-edit-link {
  color: var(--color-progressive, #36c);
  text-decoration: none;
}

.section-edit-link:hover {
  text-decoration: underline;
}

.subsection-title {
  font-size: 18px;
  font-weight: 600;
}

.minerva-skin .subsection-title {
  font-size: 20px;
}

.heading-divider {
  height: 1px;
  background-color: #a2a9b1;
  width: 100%;
}

.subsection-heading {
  font-family: 'Source Serif Pro', serif;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
  color: #202122;
  margin-top: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid #a2a9b1;
  padding-bottom: 2px;
}

.body-text ul {
  margin: 0.5em 0 0.5em 1.6em;
  padding: 0;
  list-style-type: disc;
}

.body-text ul li {
  margin-bottom: 0.3em;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 22.4px;
  color: #202122;
}

.body-text ul li a {
  color: #36c;
  text-decoration: none;
}

.body-text ul li a:hover {
  text-decoration: underline;
}

/* Infobox */
.infobox {
  width: 272px;
  flex-shrink: 0;
  background-color: #eaecf0;
  border: 1px solid #c8ccd1;
  border-radius: 2px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.minerva-skin .infobox {
  width: 318px;
  background-color: #f8f9fa;
  border-color: #c8ccd1;
  padding: 6px;
}

@media (max-width: 639px) {
  .minerva-skin .infobox {
    width: 100%;
  }
}

.minerva-skin .infobox-image {
  max-width: 318px;
  margin: 0 auto;
  height: auto;
}

.minerva-skin .infobox-image img {
  height: auto;
  object-fit: contain;
}

.minerva-skin :deep(.cdx-icon) {
  color: var(--color-subtle, #54595d);
}

.minerva-skin.edit-mode .editor-toolbar--minerva :deep(.cdx-icon) {
  color: var(--color-base, #202122);
}

.minerva-skin.edit-mode .editor-toolbar--minerva .toolbar-btn:disabled :deep(.cdx-icon),
.minerva-skin.edit-mode .editor-toolbar--minerva .toolbar-btn-primary:disabled :deep(.cdx-icon) {
  color: var(--color-disabled, #a2a9b1);
}

.minerva-skin.edit-mode .editor-toolbar--minerva .toolbar-btn-primary:not(:disabled) :deep(.cdx-icon) {
  color: var(--color-inverted, #ffffff);
}

.minerva-skin :deep(.cdx-icon svg) {
  width: 20px;
  height: 20px;
}

.minerva-skin .infobox-title {
  font-size: 14px;
  line-height: 20px;
}

.minerva-skin .infobox-caption {
  font-size: 11px;
  line-height: 16px;
}

.minerva-skin .infobox-row {
  font-size: 14px;
  gap: 6px;
}

.minerva-skin .infobox-label {
  min-width: 80px;
}

.infobox-title {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 16px;
  line-height: 26px;
  color: #202122;
  text-align: center;
}

.infobox-image-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.infobox-image {
  width: 100%;
  height: 330px;
  overflow: hidden;
}

.infobox-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}

.infobox-caption {
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  color: #202122;
  text-align: center;
  padding: 4px;
  white-space: pre-wrap;
}

.infobox-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
}

.infobox-row-faded {
  opacity: 0.8;
}

.infobox-label {
  width: 64px;
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  line-height: 20px;
  color: #202122;
  white-space: pre-wrap;
}

.infobox-value {
  flex: 1;
  min-width: 0;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  line-height: 20px;
  color: #202122;
  white-space: nowrap;
}

.infobox-value-link {
  line-height: 20px;
  white-space: pre-wrap;
}

.infobox-value a {
  color: #36c;
  text-decoration: none;
}

.infobox-value a:hover {
  text-decoration: underline;
}

/* Additional Paragraphs */
.additional-paragraphs {
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: #202122;
  white-space: pre-wrap;
}

.additional-paragraphs p {
  margin: 0 0 16px 0;
  line-height: 22px;
}

.additional-paragraphs p:last-child {
  margin-bottom: 0;
}

.additional-paragraphs a {
  color: #36c;
  text-decoration: none;
}

.additional-paragraphs a:hover {
  text-decoration: underline;
}

/* ===== TOOLS SIDEBAR (RIGHT) ===== */
.tools-sidebar {
  width: 208px;
  flex-shrink: 0;
  padding-top: 56px;
  border-radius: 2px;
}

@media (max-width: 1119px) {
  .tools-sidebar {
    display: none;
  }
}

.tools-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tools-header {
  padding-bottom: 6px;
  border-bottom: 1px solid #dadde3;
  display: flex;
  align-items: center;
  gap: 12px;
}

.tools-title {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
  margin: 0;
}

.tools-toggle {
  background-color: #eaecf0;
  border: none;
  border-radius: 2px;
  padding: 1px 6px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  line-height: 20px;
  color: #202122;
  cursor: pointer;
}

.tools-toggle:hover {
  background-color: #dadde3;
}

.tools-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 6px;
  border-bottom: 1px solid #dadde3;
}

.tools-section:last-child {
  border-bottom: none;
}

.tools-section-title {
  padding: 6px 0;
  border-bottom: 1px solid #dadde3;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #54595d;
  width: 194px;
  white-space: pre-wrap;
}

.tools-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tools-link {
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #36c;
  text-decoration: none;
  border-radius: 2px;
  white-space: pre-wrap;
  display: block;
}

.tools-link:hover {
  text-decoration: underline;
}

/* ===== EDIT MODE STYLES ===== */
.edit-mode {
  background-color: #ffffff;
}

.vector-skin.edit-mode .article {
  width: 100%;
  max-width: 949px;
  margin: 0 auto;
}

.tab {
  cursor: pointer;
}

.edit-mode-content {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  position: relative;
}

/* Editor Toolbar */
.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 42px; /* Changed from height to min-height to allow wrapping */
  flex-wrap: wrap; /* Allow items to wrap to next line */
  border-bottom: 1px solid #c8ccd1;
  box-shadow: none;
  padding: 0;
  background: #ffffff;
  position: sticky; /* Stick to top when scrolling */
  top: 0; /* Position at top of viewport */
  z-index: 10; /* Ensure toolbar is above content */
}

.editor-toolbar--scrolled {
  box-shadow: 0 4px 4px 0 rgba( 0, 0, 0, 0.06 ), 0 0 8px 0 rgba( 0, 0, 0, 0.06 );
}

.editor-toolbar--minerva {
  justify-content: space-between;
  gap: 0;
}

.editor-toolbar--minerva .toolbar-btn-primary {
  margin-left: 0;
  width: 44px;
  height: 42px;
  padding: 0;
  border-radius: 0;
}

.minerva-skin.edit-mode .edit-mode-content {
  padding-top: 42px;
}

.minerva-skin.edit-mode .editor-toolbar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  width: 100%;
  max-width: 994px;
}

.editor-toolbar-left,
.editor-toolbar-right {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap; /* Allow buttons to wrap within each section */
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 42px;
  padding: 5px 13px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 2px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #202122;
}

.toolbar-btn:hover {
  background-color: #f8f9fa;
}

.toolbar-btn-icon-only {
  width: 40px;
  padding: 5px;
}

.toolbar-btn-disabled {
  color: #a2a9b1;
  cursor: not-allowed;
}

.toolbar-btn-disabled:hover {
  background-color: transparent;
}

.toolbar-btn-disabled .cdx-icon {
  color: #a2a9b1;
}

.toolbar-btn-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #202122;
}

.toolbar-btn-dropdown {
  padding-left: 7px;
  padding-right: 9px;
}

.toolbar-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 5px 13px;
  background: #36c;
  border: 1px solid #6485d1;
  border-radius: 2px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #ffffff;
}

.toolbar-btn-primary:hover {
  background: #447ff5;
}

.toolbar-btn-primary--disabled {
  background: #eaecf0;
  border-color: #c8ccd1;
  color: #a2a9b1;
  cursor: not-allowed;
}

.toolbar-btn-primary--disabled:hover {
  background: #eaecf0;
}

.dropdown-icon {
  margin-left: 2px;
}

/* Loading Overlay - covers entire page */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--background-color-backdrop-light, rgba(255, 255, 255, 0.65));
  z-index: 100; /* Higher z-index to cover suggestion card */
}

/* ProgressBar - centered on page */
.loading-progress {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101; /* Above overlay */
  width: 512px;
  max-width: calc(100% - 64px); /* Responsive with 32px padding on each side */
}

/* Edit Header */
.edit-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0 16px;
  background-color: var(--background-color-base, #ffffff);
}

.tagline-edit {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: #72777d;
  margin: 0;
}

.short-description-section {
  display: flex;
  align-items: center;
}

.short-description-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 4px;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 2px;
  cursor: pointer;
}

.short-description-icon {
  color: #a2a9b1;
}

.short-description-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #a2a9b1;
}

/* Edit Mode Grid Layout - applies to the entire article + suggestions in edit mode */
.vector-skin.edit-mode .main-content-area {
  display: grid;
  width: 100%;
  align-items: start;
  /* Default (no suggestions): 32px margin + centered column + 32px margin */
  grid-template-columns: 32px 1fr minmax(0, 949px) 1fr 32px;
  transition: grid-template-columns 250ms ease;
  padding: 0;
  gap: 0;
}

/* With suggestions: 32px margin + article + sidebar + 32px margin (no gap) */
.vector-skin.edit-mode .main-content-area.has-suggestions {
  grid-template-columns: 32px minmax(0, 949px) 24px 325px 32px;
}

/* Article takes center column when no suggestions */
.vector-skin.edit-mode .main-content-area .article {
  grid-column: 3; /* Center column (after left margin + left spacer) */
  width: 100%;
  max-width: 949px;
}

/* Article takes second column when suggestions are active */
.vector-skin.edit-mode .main-content-area.has-suggestions .article {
  grid-column: 2; /* Second column (after left margin) */
  width: 100%;
  max-width: 949px;
}

/* Suggestions sidebar - third column (no gap) */
.suggestions-sidebar {
  grid-column: 4; /* Fourth column (after left margin + article + gap) */
  width: 100%;
  max-width: 325px;
  position: relative;
  align-self: start;
  min-height: 100%; /* Allow sidebar to contain absolutely positioned cards */
  padding-top: 0;
}

.suggestions-viewport-notification {
  width: 100%;
  border: 1px solid #dadde3;
  background: #ffffff;
  color: var(--color-subtle, #54595d);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  padding: 10px 12px;
  border-radius: 2px;
  cursor: pointer;
  text-align: left;
  max-width: 100%;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: start;
  gap: 8px;
}

.suggestions-viewport-number {
  font-weight: 700;
  color: var(--color-progressive, #36c);
}

.suggestions-viewport-notification:hover,
.suggestions-viewport-notification:active {
  background: #ffffff;
}

.suggestions-viewport-notification:focus-visible {
  outline: 2px solid var(--color-progressive, #36c);
  outline-offset: 2px;
}

/* Positioned suggestion cards within sidebar */
.suggestion-card-positioned {
  position: absolute;
  left: 0;
  width: 100%;
  transition: top 250ms ease; /* Smooth transition for alignment */
}

/* Article content wrapper in edit mode */
.article-content-edit {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.article-main-edit {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 949px;
}

.article-first-section {
  display: flex;
  gap: 16px;
  width: 100%;
}

.article-text-block {
  flex: 1;
  min-width: 0;
}

.article-text-editable {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #202122;
  outline: none;
}

.minerva-skin .article-text-editable {
  font-size: 16px;
  line-height: 24px;
}

.article-text-editable p {
  margin: 0 0 8px 0;
}

.article-text-editable a {
  color: #36c;
  text-decoration: none;
}

.article-text-editable a:hover {
  text-decoration: underline;
}

.section-heading-edit {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 20px;
  width: 100%;
}

.heading-text-edit {
  font-family: 'Source Serif Pro', serif;
  font-size: 21px;
  font-weight: 400;
  line-height: 27.3px;
  color: #202122;
  margin: 0;
}

/* Infobox (shared between Read and Edit modes) */
.infobox-title {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  color: #202122;
  text-align: center;
}

.infobox-image-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.infobox-image img {
  width: 100%;
  height: auto;
  display: block;
}

.infobox-caption {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: #202122;
  text-align: center;
  padding: 4px;
}

.infobox-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
  line-height: 20px;
}

.infobox-row-faded {
  opacity: 0.8;
}

.infobox-label {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: #202122;
  width: 64px;
  flex-shrink: 0;
}

.infobox-value {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  color: #202122;
  flex: 1;
}

.infobox-value a {
  color: #36c;
  text-decoration: none;
}

.infobox-value a:hover {
  text-decoration: underline;
}

@media (max-width: 1119px) {
  .article-first-section {
    flex-direction: column;
  }
  
  .article-first-section .infobox {
    width: 100%;
  }
}

/* ===== SUGGESTION MODE STYLES ===== */
/* Toggle Button for Suggestions - using Codex ToggleButton quiet */
.suggestions-toggle-btn {
  width: 40px;
  height: 42px;
  min-width: 40px;
  min-height: 42px;
  padding: 5px;
}

/* Override Codex default padding for icon-only button */
.suggestions-toggle-btn :deep(button) {
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Lightbulb icon wrapper */
.lightbulb-icon-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

/* Rays container */
.bulb-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* Individual ray styling - 5 rays in semicircle */
.ray {
  position: absolute;
  width: 2px;
  height: 3px;
  background-color: #36c;
  border-radius: 0.5px;
  opacity: 0;
  animation: rayFadeIn 0.3s ease-out forwards;
  top: 50%;
  left: 50%;
  transform-origin: center center;
}

/* Ray 1: Far left (~-60deg from top) - 3px gap from bulb (adjusted for angle) */
.ray-1 {
  transform: translate(-50%, -50%) rotate(-60deg) translateY(-13px);
  animation-delay: 0s;
}

/* Ray 2: Mid-left (~-30deg from top) - 3px gap from bulb (adjusted for angle) */
.ray-2 {
  transform: translate(-50%, -50%) rotate(-30deg) translateY(-12.5px);
  animation-delay: 0.05s;
}

/* Ray 3: Top center (0deg) - 3px gap from bulb */
.ray-3 {
  transform: translate(-50%, -50%) rotate(0deg) translateY(-12px);
  animation-delay: 0.1s;
}

/* Ray 4: Mid-right (~30deg from top) - 3px gap from bulb (adjusted for angle) */
.ray-4 {
  transform: translate(-50%, -50%) rotate(30deg) translateY(-12.5px);
  animation-delay: 0.15s;
}

/* Ray 5: Far right (~60deg from top) - 3px gap from bulb (adjusted for angle) */
.ray-5 {
  transform: translate(-50%, -50%) rotate(60deg) translateY(-13px);
  animation-delay: 0.2s;
}

/* Ray fade-in animation */
@keyframes rayFadeIn {
  0% {
    opacity: 0;
    height: 2px;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    height: 3px;
  }
}

/* Icon color when active */
.suggestions-toggle-btn--active :deep(.cdx-icon) {
  color: #36c;
  animation: iconGlow 0.4s ease-out;
}

/* Icon glow animation */
@keyframes iconGlow {
  0% {
    filter: brightness(1);
    transform: scale(1);
  }
  40% {
    filter: brightness(1.2);
    transform: scale(1.08);
  }
  100% {
    filter: brightness(1.1);
    transform: scale(1);
  }
}

/* Suggestion Container - wraps highlighted text and card */
.suggestion-container {
  position: relative;
  width: 100%;
}

/* ===== HIGHLIGHTED TEXT STATES ===== */
.suggestion-target {
  position: relative;
  margin: 0;
  cursor: pointer;
}

/* Wrapper with rail (vertical line) - p element with flex */
.highlighted-text-wrapper {
  display: flex;
  gap: 8px; /* 8px space between rail and text */
  align-items: flex-start;
  margin: 0;
}

/* Rail - vertical blue line that covers full height */
.highlighted-text-rail {
  display: inline-block;
  width: 2px;
  background-color: #36c;
  flex-shrink: 0;
  align-self: stretch; /* Stretches to match content height */
}

/* Text content with per-line backgrounds */
.highlighted-text-content {
  flex: 1;
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #202122;
  position: relative;
  z-index: 2;
  /* Make background apply per-line */
  display: inline;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

/* Default state - subtle gray per line */
.highlighted-text-wrapper .highlighted-text-content {
  background-color: #f8f9fa;
  border-radius: 2px;
  padding: 0 2px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

/* Hover state - blue background per line */
.highlighted-text-wrapper--hover .highlighted-text-content {
  background-color: #e8eeff;
}

/* Selected state - blue background per line */
.highlighted-text-wrapper--selected .highlighted-text-content {
  background-color: #e8eeff;
}

.minerva-skin .highlighted-text-wrapper .highlighted-text-content {
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  line-height: 24px;
  background-image: linear-gradient(var(--background-color-neutral-subtle, #f8f9fa), var(--background-color-neutral-subtle, #f8f9fa));
  background-size: 100% 24px;
  background-repeat: repeat-y;
}

.minerva-skin .highlighted-text-wrapper--hover .highlighted-text-content,
.minerva-skin .highlighted-text-wrapper--selected .highlighted-text-content {
  background-image: linear-gradient(var(--background-color-progressive-subtle, #e8eeff), var(--background-color-progressive-subtle, #e8eeff));
}

/* Links inside highlighted text */
.highlighted-text-content a {
  color: #36c;
  text-decoration: none;
}

.highlighted-text-content a:hover {
  text-decoration: underline;
}

.minerva-suggestion-target {
  padding-right: 0;
  position: relative;
  z-index: 3;
}

.minerva-suggestion-target .highlighted-text-rail {
  display: none;
}

.minerva-highlight-rail {
  position: absolute;
  right: calc(var(--minerva-suggestion-gutter, 44px) - 61px);
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #36c;
  border-radius: 2px;
  z-index: 4;
}

.minerva-suggestion-trigger {
  position: absolute;
  right: calc(-1 * (var(--minerva-suggestion-gutter, 44px) + 16px) + 12px);
  top: 0;
  transform: none;
  width: 20px;
  height: 20px;
  border-radius: 0;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-progressive, #36c);
  cursor: pointer;
  box-shadow: none;
  z-index: 5;
}

.minerva-suggestion-trigger :deep(.cdx-icon),
.minerva-suggestion-trigger :deep(svg) {
  color: var(--color-progressive, #36c);
  fill: var(--color-progressive, #36c);
}

.minerva-suggestion-trigger:active {
  background-color: transparent;
}

.minerva-suggestions-on .article-content-edit {
  --minerva-suggestion-gutter: 44px;
  padding-right: calc(var(--minerva-suggestion-gutter) + 16px);
  position: relative;
  background: var(--background-color-base, #ffffff);
}

.minerva-suggestions-on .minerva-suggestion-target {
  padding-right: 0;
}

.minerva-suggestions-on {
  background-color: var(--background-color-base, #ffffff);
}

.minerva-suggestions-on .article-content-edit::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: var(--minerva-suggestion-gutter);
  height: 100%;
  background-color: var(--background-color-neutral-subtle, #f8f9fa);
  pointer-events: none;
}


.minerva-suggestions-toggle {
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 999px;
  border: 1px solid var(--border-color-base, #a2a9b1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 70;
  background: var(--color-base, #ffffff);
}


.minerva-suggestions-toggle :deep(.cdx-icon) {
  color: var(--color-base, #202122);
}

.minerva-suggestions-toggle--active {
  background: var(--color-progressive-subtle, #e8eeff);
  border-color: var(--color-progressive, #36c);
}

.minerva-suggestions-toggle--active :deep(.cdx-icon) {
  color: var(--color-progressive, #36c);
}

.minerva-suggestions-toggle :deep(button) {
  width: 100%;
  height: 100%;
  padding: 0;
  position: relative;
}

.minerva-bottom-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #c8ccd1;
  box-shadow: var(--box-shadow-medium, 0 4px 4px 0 rgba(0, 0, 0, 0.06), 0 0 8px 0 rgba(0, 0, 0, 0.06));
  z-index: 80;
  padding: 16px 16px 20px;
}

.minerva-sheet-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
}

.minerva-sheet-title {
  font-size: 16px;
  font-weight: 600;
  color: #202122;
}

.minerva-sheet-close {
  margin-left: auto;
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  color: #54595d;
}

.minerva-sheet-close :deep(svg) {
  transform: none;
}

.minerva-sheet-description {
  margin-top: 0;
  font-size: 16px;
  line-height: 24px;
  color: #54595d;
}

.minerva-sheet-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.minerva-sheet-btn {
  min-width: 88px;
}

.minerva-skin.edit-mode .edit-mode-content {
  padding-bottom: 88px;
}

/* ===== SUGGESTION CARD STATES ===== */
.suggestion-card {
  width: 100%; /* Full width of container (325px) */
  background-color: white;
  border-radius: 2px;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Collapsed state - default */
.suggestion-card--collapsed {
  border: 1px solid #dadde3;
  box-shadow: none;
}

/* Collapsed state - hover */
.suggestion-card--collapsed.suggestion-card--hover {
  border: 1px solid #3056a9;
}

.suggestion-card--collapsed.suggestion-card--hover .suggestion-header {
  background-color: #e8eeff;
}

/* Collapsed state - active (press) */
.suggestion-card--collapsed:active {
  border: 1px solid #233566;
}

.suggestion-card--collapsed:active .suggestion-header {
  background-color: #e8eeff;
}

/* Collapsed state - focus */
.suggestion-card--collapsed:focus-within {
  border: 2px solid #36c;
  background-color: white;
}

/* Expanded state - default */
.suggestion-card--expanded {
  border: 1px solid #6485d1;
  box-shadow: 
    0px 4px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 16px 0px rgba(0, 0, 0, 0.06);
}

/* Expanded state - hover */
.suggestion-card--expanded.suggestion-card--hover .suggestion-header {
  cursor: pointer;
}

.suggestion-card--expanded.suggestion-card--hover {
  border: 1px solid #3056a9;
}

/* Expanded state - active */
.suggestion-card--expanded .suggestion-header:active {
  border: 1px solid #233566;
}

/* ===== SUGGESTION HEADER ===== */
.suggestion-header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  min-height: 40px;
  border: none;
  width: 100%;
  text-align: left;
  transition: background-color 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.suggestion-header--collapsed {
  cursor: pointer;
  background-color: transparent;
}

.suggestion-header--expanded {
  cursor: pointer;
  background-color: #e8eeff;
}

.suggestion-header:focus {
  outline: none;
}

.suggestion-icon {
  width: 18px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.suggestion-icon .cdx-icon {
  color: #36c;
}

.suggestion-title {
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #202122;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* ===== SUGGESTION CONTENT (expanded only) ===== */
.suggestion-content {
  background-color: white;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.suggestion-description {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #54595d;
  margin: 0;
  white-space: pre-wrap;
  cursor: default;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.suggestion-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.suggestion-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  min-width: 32px;
  max-width: 448px;
  padding: 4px 12px;
  background-color: #f8f9fa;
  border: 1px solid #72777d;
  border-radius: 2px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #202122;
  text-align: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.suggestion-btn:hover {
  background-color: #ffffff;
  border-color: #202122;
}

.suggestion-btn:active {
  background-color: #eaecf0;
  border-color: #72777d;
}

.suggestion-btn:disabled {
  background-color: #dadde3;
  border-color: transparent;
  color: #a2a9b1;
  cursor: not-allowed;
}

/* Suggestion card maintains fixed 325px width across all breakpoints */

/* ===== CITATION MARKER ===== */
.citation-marker {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 1;
  color: #36c;
  cursor: pointer;
  margin-left: 1px;
}

.citation-marker:hover {
  text-decoration: underline;
}

/* ===== CITATION POPUP ===== */
.citation-popup {
  position: absolute;
  width: 448px;
  max-width: calc(100vw - 32px);
  background: white;
  border: 1px solid #a2a9b1;
  border-radius: 2px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.06), 0px 0px 8px 0px rgba(0, 0, 0, 0.06);
  z-index: 50;
  margin-top: 12px;
}

.minerva-skin .citation-popup {
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100%;
  border-radius: 0;
  margin-top: 0;
  z-index: 90;
  display: flex;
  flex-direction: column;
}

.minerva-skin .citation-popup-pointer {
  display: none;
}

.minerva-skin .citation-popup-content {
  flex: 1;
  overflow-y: auto;
}

/* Pointer arrow pointing up */
.citation-popup-pointer {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%) rotate(225deg);
  width: 16px;
  height: 16px;
  background: white;
  border: 1px solid #a2a9b1;
  border-left: none;
  border-top: none;
}

.citation-popup-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;
}

.citation-popup-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 5px;
  background: transparent;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  color: #202122;
  flex-shrink: 0;
}

.citation-popup-close:hover {
  background-color: #f8f9fa;
}

.citation-popup-title {
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  color: #202122;
  margin: 0;
  text-align: center;
}

.citation-popup-tabs {
  display: flex;
  gap: 4px;
  background-color: #eaecf0;
  padding: 8px 8px 0 8px;
}

.citation-tab {
  padding: 4px 12px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #202122;
  background: transparent;
  border: none;
  border-radius: 2px 2px 0 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.citation-tab:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.citation-tab--active {
  background-color: white;
  color: #202122;
}

.citation-popup-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
}

.citation-popup-description {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #202122;
  margin: 0;
}

/* Input group: input + button together */
.citation-input-group {
  display: flex;
  align-items: center;
  gap: 0;
}

.citation-input {
  flex: 1;
  height: 32px;
  padding: 4px 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
  border: 1px solid #72777d;
  border-right: none;
  border-radius: 2px 0 0 2px;
  outline: none;
  transition: border-color 0.2s ease;
}

.citation-input:hover {
  border-color: #202122;
}

.citation-input:focus {
  border-color: #36c;
  box-shadow: inset 0 0 0 1px #36c;
}

.citation-create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  min-width: 32px;
  padding: 4px 12px;
  background-color: #f8f9fa;
  border: 1px solid #72777d;
  border-radius: 0 2px 2px 0;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #202122;
  text-align: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  flex-shrink: 0;
}

.citation-create-btn:hover {
  background-color: #ffffff;
  border-color: #202122;
}

.citation-create-btn:active {
  background-color: #eaecf0;
  border-color: #72777d;
}

.citation-create-btn:disabled {
  background-color: #dadde3;
  border-color: #dadde3;
  color: #a2a9b1;
  cursor: not-allowed;
}

/* ===== SUCCESS MESSAGE ===== */
.success-message {
  position: absolute;
  width: 100%;
  display: flex;
  align-items: start;
  gap: 8px;
  padding: 10px 12px;
  background-color: #ffffff;
  border: 1px solid #a2a9b1;
  border-radius: 2px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.06), 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
}

.minerva-skin .success-message--minerva {
  position: fixed;
  top: 58px;
  left: 16px;
  right: 16px;
  z-index: 70;
  width: auto;
  margin: 0;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 20px;
  flex-shrink: 0;
}

.success-icon :deep(svg) {
  fill: #099979;
}

.success-content {
  flex: 1;
  min-width: 0;
}

.success-text {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #202122;
}

/* ===== EMPTY STATE ===== */
.empty-state {
  width: 100%;
  display: flex;
  align-items: start;
  gap: 8px;
  padding: 10px 12px;
  background-color: #ffffff;
  border: 1px solid #dadde3;
  border-radius: 2px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.empty-state-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 20px;
  flex-shrink: 0;
}

.empty-state-icon :deep(svg) {
  fill: var(--color-placeholder, #72777d);
}

.empty-state-content {
  flex: 1;
  min-width: 0;
}

.empty-state-text {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--color-placeholder, #72777d);
}

.suggestions-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 8px;
  margin: 0 0 8px;
  height: 40px;
  padding: 0 12px;
  border: none;
  border-bottom: 1px solid var(--border-color-muted, #c8ccd1);
  background: var(--background-color-progressive-subtle, #eaf3ff);
  border-radius: 0;
  font-family: 'Inter', sans-serif;
  color: var(--color-base, #202122);
  position: sticky;
  top: 42px;
  z-index: 11;
  text-align: center;
  transform-origin: top;
  will-change: transform, opacity;
}

.suggestions-banner--scrolled {
  box-shadow: 0 4px 4px 0 rgba( 0, 0, 0, 0.06 ), 0 0 8px 0 rgba( 0, 0, 0, 0.06 );
}

.banner-reveal-enter-active,
.banner-reveal-leave-active {
  transition: transform 220ms ease, opacity 220ms ease;
}

.banner-reveal-enter-from,
.banner-reveal-leave-to {
  transform: scaleY(0.1);
  opacity: 0;
}

.banner-reveal-enter-to,
.banner-reveal-leave-from {
  transform: scaleY(1);
  opacity: 1;
}

.suggestions-banner--clickable:not(.suggestions-banner--empty):hover {
  background: var(--background-color-progressive-subtle--hover, #dbe8ff);
}

.suggestions-banner--clickable:not(.suggestions-banner--empty):active {
  background: var(--background-color-progressive-subtle--active, #c5d7ff);
}

.suggestions-banner--closing {
  animation: banner-to-badge 220ms ease forwards;
  transform-origin: right center;
  pointer-events: none;
}

.suggestions-banner--opening {
  animation: badge-to-banner 220ms ease forwards;
  transform-origin: right center;
  pointer-events: none;
}

@keyframes banner-to-badge {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.2);
  }
}

@keyframes badge-to-banner {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.suggestions-banner--empty {
  background: var(--background-color-neutral-subtle, #f8f9fa);
  color: var(--color-subtle, #54595d);
}

.suggestions-banner--hidden {
  background: var(--background-color-base, #ffffff);
}

.suggestions-banner-text {
  min-width: 0;
}

.suggestions-banner-center {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.suggestions-banner-actions {
  position: absolute;
  right: 12px;
  display: inline-flex;
  align-items: center;
}

.suggestions-banner-action {
  height: 24px;
}

.suggestions-banner-action :deep(button) {
  height: 24px;
  max-height: 24px;
  min-height: 24px;
  padding: 0 8px;
  line-height: 24px;
}

.suggestions-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border-radius: 2px;
  background: var(--background-color-progressive, #36c);
  color: #ffffff;
  border: 1px solid var(--border-color-inverted, #ffffff);
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  z-index: 2;
  pointer-events: none;
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(50%, 50%);
}

.suggestions-badge--empty {
  background: var(--background-color-neutral, #eaecf0);
  color: #202122;
}


.minerva-skin .suggestions-badge {
  font-size: 14px;
  line-height: 16px;
}

.suggestions-banner-close {
  display: inline-flex;
}

.suggestions-banner-close :deep(button) {
  padding: 0;
}

.minerva-skin .suggestions-banner--minerva-bottom {
  position: fixed;
  bottom: 0;
  top: auto;
  margin: 0;
  z-index: 69;
  left: 0;
  right: 0;
}

.minerva-skin .suggestions-banner--minerva {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.minerva-skin .suggestions-banner--minerva-top {
  position: fixed;
  top: 42px;
  bottom: auto;
  margin: 0;
  z-index: 70;
  left: 0;
  right: 0;
}

.minerva-skin .suggestions-viewport-notification--minerva,
.minerva-skin .empty-state--minerva {
  position: fixed;
  bottom: 0;
  top: auto;
  left: 0;
  right: 0;
  margin: 0;
  z-index: 69;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.vector-skin .suggestions-banner {
  font-size: 12px;
  line-height: 16px;
}

.minerva-skin .suggestions-banner {
  font-size: 14px;
  line-height: 20px;
}

.edit-mode.suggestion-light-flash::after {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(60% 50% at 50% 0%, rgba(255, 248, 230, 0.55) 0%, rgba(255, 248, 230, 0.2) 45%, rgba(255, 248, 230, 0) 70%);
  opacity: 0;
  pointer-events: none;
  z-index: 5;
  animation: suggestion-light-glow 900ms ease;
}

@keyframes suggestion-light-glow {
  0% {
    opacity: 0;
  }
  35% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.prototype-dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(32, 33, 36, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.prototype-dialog {
  width: 420px;
  max-width: calc(100% - 32px);
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.prototype-dialog-header {
  margin-bottom: 16px;
}

.prototype-dialog-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #202122;
}

.prototype-dialog-options {
  border: none;
  padding: 0;
  margin: 0 0 20px;
  display: grid;
  gap: 12px;
}

.prototype-radio {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #202122;
}

.prototype-radio input {
  accent-color: #36c;
}

.prototype-dialog-actions {
  display: flex;
  justify-content: flex-end;
}

.prototype-dialog-btn {
  background: #36c;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.prototype-dialog-btn:hover {
  background: #2a4b8d;
}

.suggestion-notification {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0 16px;
  padding: 12px 14px;
  border-radius: 6px;
  background: #f8f9fa;
  border: 1px solid #eaecf0;
  color: #202122;
}

.suggestion-notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.suggestion-notification-text {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
}

.suggestion-notification-card {
  position: sticky;
  top: 0;
  cursor: pointer;
  border: 1px solid var(--border-color-muted, #c8ccd1);
  background: var(--background-color-base, #ffffff);
  box-shadow: none;
}

.suggestion-notification-card:focus-visible {
  outline: 2px solid #36c;
  outline-offset: 2px;
}

.suggestion-notification-header {
  align-items: center;
  gap: 8px;
  background-color: var(--background-color-base, #ffffff);
}

.suggestion-notification-header .suggestion-title {
  white-space: nowrap;
}

.suggestion-notification-card--minerva {
  position: static;
  width: 100%;
  margin-top: 12px;
}

.suggestion-notification-action {
  width: auto;
  margin-left: auto;
}

.suggestion-notification-action--icon {
  padding: 0;
  min-width: auto;
}

.vector-skin .suggestion-notification-header .suggestion-title,
.vector-skin .suggestion-notification-action {
  font-size: 14px;
}

.minerva-sheet-header--empty :deep(svg) {
  fill: var(--color-placeholder, #72777d);
}

.minerva-sheet-header--empty .minerva-sheet-title {
  color: var(--color-placeholder, #72777d);
}

.minerva-empty-sheet-text {
  margin: 8px 0 0;
  font-size: 16px;
  line-height: 22px;
  color: var(--color-placeholder, #72777d);
}
</style>
