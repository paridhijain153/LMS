import { Link } from "react-router-dom";
import { ArrowRight, Play, Code2, Palette, Briefcase, TrendingUp, BarChart3, Camera, Music, Languages, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { CourseCard } from "@/components/CourseCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { courses, categories, testimonials } from "@/data/mockData";
import heroImg from "@/assets/image.png";
import "@/styles/pages/landing.css";
const iconMap = { Code2, Palette, Briefcase, TrendingUp, BarChart3, Camera, Music, Languages };
const Landing = () => {
    return (<div style={{ minHeight: "100vh", backgroundColor: "var(--background)" }}>
      {/* Nav */}
      <header className="landing-nav">
        <div className="landing-nav__inner container">
          <Logo />
          <nav>
            <ul className="landing-nav__links">
              <li><a href="#courses">Courses</a></li>
              <li><a href="#categories">Categories</a></li>
              <li><a href="#testimonials">Reviews</a></li>
            </ul>
          </nav>
          <div className="landing-nav__actions">
            <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
            <Button variant="hero" asChild><Link to="/signup">Get Started</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero__inner container">
          <div className="hero__content">
            <span className="hero__badge">
              <span className="hero__badge-dot"/>
              Trusted by 50,000+ learners worldwide
            </span>
            <h1 className="hero__heading">
              Learn anything,<br />
              <span className="text-gradient">anytime, anywhere.</span>
            </h1>
            <p className="hero__desc">
              Master in-demand skills with expert-led courses. Beautifully designed, distraction-free learning that fits your schedule.
            </p>
            <div className="hero__ctas">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">Start Learning <ArrowRight /></Link>
              </Button>
              <Button variant="outline" size="xl">
                <Play /> Watch demo
              </Button>
            </div>
            <div className="hero__trust">
              {["No credit card", "Cancel anytime", "7-day free trial"].map((t) => (<span key={t} className="hero__trust-item"><Check />{t}</span>))}
            </div>
          </div>
          <div className="hero__image-wrap">
            <div className="hero__image-glow"/>
            <img src={heroImg} alt="Online learning illustration" className="hero__image"/>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="stats-bar__grid container">
          {[["50K+", "Active learners"], ["1.2K+", "Expert courses"], ["350+", "Instructors"], ["98%", "Satisfaction"]].map(([n, l]) => (<div key={l} className="stat-item">
              <div className="stat-item__number text-gradient">{n}</div>
              <div className="stat-item__label">{l}</div>
            </div>))}
        </div>
      </section>

      {/* Featured */}
      <section id="courses" className="featured-section container">
        <div className="section-header">
          <div>
            <h2 className="section-heading">Featured Courses</h2>
            <p className="section-sub">Hand-picked courses from our top instructors.</p>
          </div>
          <Button variant="soft" asChild><Link to="/signup">Browse all <ArrowRight /></Link></Button>
        </div>
        <div className="courses-grid">
          {courses.map((c) => <CourseCard key={c.id} course={c}/>)}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="categories-section">
        <div className="container">
          <div className="text-center-section-title">
            <h2 className="section-heading">Explore by category</h2>
            <p className="section-sub">Find your next skill across dozens of fields.</p>
          </div>
          <div className="categories-grid">
            {categories.map((c) => {
            const Icon = iconMap[c.icon];
            return (<div key={c.name} className="category-card">
                  <div className="category-card__icon">
                    <Icon />
                  </div>
                  <h3 className="category-card__name">{c.name}</h3>
                  <p className="category-card__count">{c.count} courses</p>
                </div>);
        })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials-section container">
        <div className="text-center-section-title">
          <h2 className="section-heading">Loved by learners</h2>
          <p className="section-sub">Real stories from our community.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t) => (<div key={t.name} className="testimonial-card">
              <div className="testimonial-card__stars">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i}/>)}
              </div>
              <p className="testimonial-card__text">"{t.text}"</p>
              <div className="testimonial-card__author">
                <Avatar>
                  <AvatarFallback className="avatar__fallback--gradient">{t.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="testimonial-card__name">{t.name}</div>
                  <div className="testimonial-card__role">{t.role}</div>
                </div>
              </div>
            </div>))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section container">
        <div className="cta-card">
          <div className="cta-card__overlay"/>
          <div className="cta-card__inner">
            <h2 className="cta-card__heading">Ready to start your journey?</h2>
            <p className="cta-card__desc">Join thousands of students learning new skills every day.</p>
            <Button size="xl" style={{ marginTop: "1.5rem", backgroundColor: "var(--background)", color: "var(--foreground)" }} asChild>
              <Link to="/signup">Get started for free <ArrowRight /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer__grid container">
          <div>
            <Logo />
            <p className="landing-footer__tagline">Modern learning for ambitious people.</p>
          </div>
          {[
            { title: "Platform", links: ["Courses", "Categories", "Pricing", "For Business"] },
            { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
            { title: "Support", links: ["Help Center", "Privacy", "Terms", "Status"] },
        ].map((col) => (<div key={col.title}>
              <h4 className="landing-footer__col-title">{col.title}</h4>
              <ul className="landing-footer__links">
                {col.links.map((l) => <li key={l}><a href="#">{l}</a></li>)}
              </ul>
            </div>))}
        </div>
        <div className="landing-footer__bottom">
          © 2025 EduVibe. Crafted with care.
        </div>
      </footer>
    </div>);
};
export default Landing;
